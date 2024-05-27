require('dotenv').config();

const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io');
const {TikTokConnectionWrapper} = require('./tiktokConnectionWrapper');
const {PronounDatabase} = require('./pronounDatabase');
const {TwitchMessageConverter} = require('./twitchMessageConverter');
const {RefreshingAuthProvider, exchangeCode} = require('@twurple/auth');
const {ApiClient} = require("@twurple/api");
const {EventSubWsListener} = require("@twurple/eventsub-ws");
const {YoutubeMessageProcessor} = require('./youtubeMessageProcessor')
const {TITSConnectionWrapper} = require('./titsConnectionWrapper')

let twitchIsAuthorized = false;

const oldMessages = [];

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

const REDIRECT_URL = process.env.TWITCH_OAUTH_REDIRECT_URL;

// Setup Twitch stuff
const twitchClientId = process.env.TWITCH_CLIENT_ID;
const twitchClientSecret = process.env.TWITCH_CLIENT_SECRET;
const twitchAuthProvider = new RefreshingAuthProvider({clientId: twitchClientId, clientSecret: twitchClientSecret});
const twitchApiClient = new ApiClient({authProvider: twitchAuthProvider});

const youtubeMessageConverter = new YoutubeMessageProcessor()

const titsConnection = new TITSConnectionWrapper(process.env.TITS_URL);

const twitchBadges = {};

function storeBadges(badges, output) {
    for(let badgeIncrement in badges) {
        if (typeof twitchBadges[badges[badgeIncrement].id] === 'undefined') {
            twitchBadges[badges[badgeIncrement].id] = [];
        }
        for(let versionIncrement in badges[badgeIncrement].versions) {
            const badgeVersion = badges[badgeIncrement].versions[versionIncrement];
            twitchBadges[badges[badgeIncrement].id][badgeVersion.id] = badgeVersion.getImageUrl(2);
        }
    }
}

// Setup YouTube stuff
const youtubeApiKey = process.env.YOUTUBE_API_KEY

const pronounDB = new PronounDatabase;

function getTwitchPronouns(username) {
    pronounDB.getPronouns('twitch', username).then((pronouns) => {
        io.sockets.emit('pronouns', {
            identifier: pronounDB.getPronounIdentifier('twitch', username),
            pronouns: pronouns
        });
    }).catch(() => {});
}

function initializePostTwitchAuthorization(TWITCH_CHANNEL_ID) {
    const twitchMessageConverter = new TwitchMessageConverter(TWITCH_CHANNEL_ID, twitchApiClient);
    async function loadBadges() {
        await loadGlobalTwitchBadges();
        loadChannelTwitchBadges();
    }
    async function loadGlobalTwitchBadges() {
        const badges = await twitchApiClient.chat.getGlobalBadges();
        storeBadges(badges, false);
    }
    async function loadChannelTwitchBadges() {
        const badges = await twitchApiClient.chat.getChannelBadges(TWITCH_CHANNEL_ID);
        storeBadges(badges, false);
    }
    loadBadges();

    const twitchEventSubListener = new EventSubWsListener({apiClient: twitchApiClient});
    twitchEventSubListener.start();

    twitchEventSubListener.onChannelFollow(TWITCH_CHANNEL_ID, TWITCH_CHANNEL_ID, e => {
        try {
            io.sockets.emit('follow', {
                source: 'twitch',
                displayName: e.userDisplayName,
                username: e.userName
            })
        } catch (e) {
            console.error(e);
        }
    });

    twitchEventSubListener.onChannelRedemptionAdd(TWITCH_CHANNEL_ID, async (e) => {
        try {
            io.sockets.emit('redeem', {
                source: 'twitch',
                displayName: e.userDisplayName,
                username: e.userName,
                messageText: e.input,
                rewardTitle: e.rewardTitle,
                rewardCost: e.rewardCost,
                timeInMillis: e.redemptionDate.getTime(),
                profileImage: '/twitchimage/' + e.userName,
            })
        } catch (e) {
            console.error(e);
        }
    });

    twitchEventSubListener.onChannelCheer(TWITCH_CHANNEL_ID, async (e) => {
        getTwitchPronouns(e.userName);
        let messageText = e.message;
        try {
            messageText = twitchMessageConverter.convertBitsMessage(e.message)
        } catch (e) {
            console.error('Couldn\'t convert bits message', e)
        }

        sendMessage({
            source: 'twitch',
            displayName: e.userDisplayName,
            username: e.userName,
            hasGift: 'true',
            messageText: `(total bits: ${e.bits}) ${messageText}`,
            profileImage: '/twitchimage/' + e.userName,
        });
    });

    twitchEventSubListener.onChannelChatNotification(TWITCH_CHANNEL_ID, TWITCH_CHANNEL_ID, async (e) => {
        const basicData = {
            source: 'twitch',
            displayName: e.chatterDisplayName,
            username: e.chatterName,
            userColor: e.color,
            messageText: twitchMessageConverter.convertMessage(e.messageParts),
        };
        if (e.type === 'sub') {
            io.sockets.emit('subscribe', Object.assign({}, basicData, {
                tier: e.tier / 1000,
                months: 1,
                streak: 1,
                isPrime: e.isPrime
            }));
        } else if (e.type === 'resub') {
            io.sockets.emit('subscribe', Object.assign({}, basicData, {
                tier: e.tier / 1000,
                months: e.cumulativeMonths,
                streak: e.streakMonths,
                isPrime: e.isPrime
            }));
        } else if (e.type === 'community_sub_gift') {
            io.sockets.emit('community_gift', Object.assign({}, basicData, {
                tier: e.tier / 1000,
                amount: e.amount,
                totalGifts: e.cumulativeAmount
            }));
        } else if (e.type === 'sub_gift') {
            io.sockets.emit('subscribe_gifted', Object.assign({}, basicData, {
                tier: e.tier / 1000,
                months: 1,
                streak: 1,
                isPrime: false,
                totalGifts: e.cumulativeAmount,
                recipientDisplayName: e.recipientDisplayName,
                recipientUserName: e.recipientName
            }));
        } else if (e.type === 'gift_paid_upgrade') {
            io.sockets.emit('subscribe_upgrade', Object.assign({}, basicData, {
                fromDisplayName: e.gifterDisplayName,
                fromUserName: e.gifterName,
                from: 'gift'
            }));
            io.sockets.emit('subscribe', Object.assign({}, basicData, {
                tier: 1,
                months: 1,
                streak: 1,
                isPrime: false
            }))
        } else if (e.type === 'prime_paid_upgrade') {
            io.sockets.emit('subscribe_upgrade', Object.assign({}, basicData, {
                from: 'prime',
            }));
            io.sockets.emit('subscribe', Object.assign({}, basicData, {
                tier: e.tier / 1000,
                months: 1,
                streak: 1,
                isPrime: false
            }))
        } else if (e.type === 'pay_it_forward') {
        } else if (e.type === 'charity_donation') {
            io.sockets.emit('charity', Object.assign({}, basicData, {
                charity: e.charityName,
                amount: e.amount,
            }))
        } else if (e.type === 'announcement') {
            getTwitchPronouns(e.chatterName);
            const badges = [];
            for(let badgeName in e.badges) {
                badges.push({image: twitchBadges[badgeName][e.badges[badgeName]]});
            }
            sendMessage(Object.assign({}, basicData, {
                badges: badges,
                isAnnouncement: true,
                announcementColor: e.color,
                profileImage: '/twitchimage/' + e.chatterName,
            }));
        } else if (e.type === '') {

        }
    });

    twitchEventSubListener.onChannelChatMessage(TWITCH_CHANNEL_ID, TWITCH_CHANNEL_ID, (e) => {
        if (e.rewardId !== null) {
            // Don't show rewards - those are handled separately
            return;
        }
        getTwitchPronouns(e.chatterName);
        const badges = [];
        for(let badgeName in e.badges) {
            badges.push({image: twitchBadges[badgeName][e.badges[badgeName]]});
        }
        const message = {
            source: 'twitch',
            displayName: e.chatterDisplayName,
            username: e.chatterName,
            userColor: e.color,
            messageText: twitchMessageConverter.convertMessage(e.messageParts),
            badges: badges,
            highlight: e.messageType === 'channel_points_highlighted',
            hasGift: typeof e.bits !== 'undefined' && e.bits > 0,
            userIntro: e.messageType === 'user_intro',
            profileImage: '/twitchimage/' + e.chatterName,
        }
        if (e.parentMessageText) {
            message.parentMessage = {
                message: e.parentMessageText,
                username: e.parentMessageUserName,
                displayName: e.parentMessageUserDisplayName
            }
        }
        sendMessage(message);
    });
}

// TikTok Events
function initializeTikTok(TIKTOK_CHANNEL) {
    const tiktokOptions = {enableExtendedGiftInfo: true}
    if (process.env.TIKTOK_SESSION_ID) {
        tiktokOptions['sessionId'] = process.env.TIKTOK_SESSION_ID
    }
    const tikTok = new TikTokConnectionWrapper(TIKTOK_CHANNEL, tiktokOptions);
    initializeTiktokListeners(tikTok)
    tikTok.connect()
}

function initializeTiktokListeners(tikTok) {
    tikTok.connection.on('gift', data => {
        if (data.giftType !== 1 || data.repeatEnd) {
            // diamondCount is for one of the gifts in the sequence, not the totality
            let diamondCount = data.diamondCount * data.repeatCount;
            io.sockets.emit('gift', {
                source: 'tiktok',
                displayName: data.nickname,
                username: data.uniqueId,
                diamondCount: diamondCount,
                giftName: data.giftName,
                giftAmount: data.repeatCount,
                giftImage: data.giftPictureUrl,
            });
            if (data.giftName === 'Heart Me') {
                titsConnection.throwItem(process.env.HEART_ME_ITEM, 10);
            }
        } else if (data.giftName === 'Rose') {
            try {
                titsConnection.throwItem(process.env.ROSE_ITEM, 1);
            } catch(e) {
                console.warn(e)
            }
        }
    })

    tikTok.connection.on('rawData', (name, data) => {
        // console.log(name, data);
    });

    tikTok.connection.on('subscribe', data => {
        io.sockets.emit('subscribe', {
            type: 'subscribe',
            source: 'tiktok',
            displayName: data.nickname,
            username: data.uniqueId,
        })
    });

    tikTok.connection.on('like', data => {
        io.sockets.emit('like', {
            type: 'react',
            reactType: 'like',
            source: 'tiktok',
            displayName: data.nickname,
            username: data.uniqueId
        });
    });

    tikTok.connection.on('follow', data => {
        io.sockets.emit('follow', {
            source: 'tiktok',
            displayName: data.nickname,
            username: data.uniqueId
        });
    })

    tikTok.connection.on('share', data => {
        io.sockets.emit('share', {
            source: 'tiktok',
            displayName: data.nickname,
            username: data.uniqueId
        })
    })

    tikTok.connection.on('chat', data => {
        // console.log('chat', data);
        /**
         *  userBadges: [
         *     {
         *       badgeSceneType: 1,
         *       type: 'pm_mt_moderator_im', // moderator badge
         *       name: 'Moderator'
         *     },
         *     {
         *       type: 'image',
         *       badgeSceneType: 4, // subscription badge
         *       displayType: 1,
         *       url: 'https://p19-webcast.tiktokcdn.com/webcast-va/subs_badge_icon_022.png~tplv-obj.image'
         *     },
         *     {
         *       type: 'privilege',
         *       privilegeId: '7328689450303671083',
         *       level: 1,
         *       badgeSceneType: 4
         *     },
         *     {
         *       type: 'privilege',
         *       privilegeId: '7138381176787539748', // global badge level
         *       level: 7,
         *       badgeSceneType: 8
         *     },
         *     {
         *       type: 'privilege',
         *       privilegeId: '7196929090442529541', // team level
         *       level: 15,
         *       badgeSceneType: 10
         *     },
         *     {
         *       type: 'privilege',
         *       privilegeId: '7328689450303671083',
         *       level: 1,
         *       badgeSceneType: 4
         *     }
         *   ],
         */
        let comment = typeof data.comment !== 'undefined' ? data.comment : '';

        let startLength = 0;
        for (let emoteIndex in data.emotes) {
            const emote = data.emotes[emoteIndex];
            const imageString = `<img src="${emote.emoteImageUrl}">`;
            startLength += imageString.length;
            comment = comment.substring(0, emote.placeInComment + startLength) + imageString + comment.substring(emote.placeInComment + startLength);
        }

        const badges = [];
        let isMod = false;

        for (let badgeIncrement in data.userBadges) {
            const badge = data.userBadges[badgeIncrement];
            if (badge.type === 'pm_mt_moderator_im') {
                // Add moderator badge
                isMod = true;
            }
            if (badge.type === 'image') {
                badges.push({image: badge.url});
            }
        }

        if (data.gifterLevel) {
            badges.push({type: 'gifterLevel', text: data.gifterLevel});
        }
        if (data.teamMemberLevel) {
            badges.push({type: 'teamLevel', text: data.teamMemberLevel});
        }

        sendMessage({
            type: 'chat',
            profileImage: data.profilePictureUrl,
            badges: badges,
            source: 'tiktok',
            displayName: data.nickname,
            username: data.uniqueId,
            messageText: comment,
            mod: isMod,
        });
    });

    let tikTokConnectionAttempt = 1;
    tikTok.connection.on('connect', (e) => {
        tikTokConnectionAttempt = 0;
    });
    tikTok.connection.on('disconnect', (e) => {
        if (tikTokConnectionAttempt > 5) {
            return;
        }
        ++tikTokConnectionAttempt;
        setInterval(() => {
            tikTok.connect()
        }, tikTokConnectionAttempt * 1000);
    })
}

function sendMessage(messageData) {
    // Finish assembling messageData
    if (typeof messageData.partner === 'undefined') {
        messageData.partner = false;
    }
    if (typeof messageData.firstMessage === 'undefined') {
        messageData.firstMessage = false;
    }
    if (typeof messageData.returningChatter === 'undefined') {
        messageData.returningChatter = false;
    }
    if (typeof messageData.subscriber === 'undefined') {
        messageData.subscriber = false;
    }
    if (typeof messageData.mod === 'undefined') {
        messageData.mod = false;
    }
    if (typeof messageData.vip === 'undefined') {
        messageData.vip = false;
    }
    if (typeof messageData.founder === 'undefined') {
        messageData.founder = false;
    }
    if (typeof messageData.broadcaster === 'undefined') {
        messageData.broadcaster = false;
    }
    if (typeof messageData.parentMessage === 'undefined') {
        messageData.parentMessage = null;
    }
    if (typeof messageData.userColor === 'undefined') {
        messageData.userColor = null;
    }
    if (typeof messageData.timeInMillis === 'undefined') {
        messageData.timeInMillis = Date.now();
    }
    if (typeof messageData.badges === 'undefined') {
        messageData.badges = [];
    }
    if (typeof messageData.highlight === 'undefined') {
        messageData.highlight = false;
    }
    if (typeof messageData.isAnnouncement === 'undefined') {
        messageData.isAnnouncement = false;
    }
    if (typeof messageData.announcementColor === 'undefined') {
        messageData.announcementColor = null;
    }
    if (typeof messageData.hasGift === 'undefined') {
        messageData.hasGift = false;
    }
    if (typeof messageData.userIntro === 'undefined') {
        messageData.userIntro = false;
    }
    if (typeof messageData.profileImage === 'undefined') {
        messageData.profileImage = null;
    }

    // Send it
    io.sockets.emit('chat', messageData);

    // Manage old data for new connections
    oldMessages.push(messageData);
    if (oldMessages.length > 100) {
        oldMessages.shift();
    }
}

/* at 10,000 requests, 2 streams watched lasts ~3 hours.
 * So we spend ~28 reqs/m - which would be one request every 2 seconds, but it was one request every 12 so wtf
 */

const YOUTUBE_MIN_WAIT_TIME = process.env.YOUTUBE_API_WAIT_TIME;
async function subscribeToYouTubeChat(liveChatId) {
    // Get existing messages and begin polling
    let getResultAttempts = 0;
    async function getPageResult(pageToken) {
        if (getResultAttempts >= 10) {
            console.error(`Permanently Failed to get chat messages for ${liveChatId}`);
            return;
        }
        ++getResultAttempts;
        const URL_TEMPLATE = `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet,authorDetails&maxResults=100&key=${youtubeApiKey}`
        fetch(pageToken === null ? URL_TEMPLATE : URL_TEMPLATE + `&pageToken=${pageToken}`).then(async (messageResult) => {
            if (!messageResult.ok) {
                console.warn(`Failed to get chat messages for ${liveChatId} (${messageResult.status + ': ' + messageResult.statusText}, scheduling retry`)
                let shouldRetry = true;
                try {
                    const data = await messageResult.json();
                    if (
                        data.error.code === 403 && (
                            data.error.message.indexOf('The live chat is no longer live') > -1 ||
                            data.error.message.indexOf('you have exceeded your') > -1
                        )
                    ) {
                        shouldRetry = false;
                    }
                } catch (e) {
                    console.debug('Error decoding JSON from YouTube Chat failure', e)
                }
                if (shouldRetry) {
                    setTimeout(() => {
                        getPageResult(pageToken)
                    }, YOUTUBE_MIN_WAIT_TIME);
                }
                return;
            }
            getResultAttempts = 0;
            const chatDetails = await messageResult.json();
            console.log('Success', chatDetails.nextPageToken, chatDetails.pollingIntervalMillis, chatDetails.offlineAt);
            for (let itemIndex in chatDetails.items) {
                const message = chatDetails.items[itemIndex];
                if (message.snippet.type !== 'textMessageEvent') {
                    continue;
                }
                console.log(message);
                sendMessage({
                    source: 'youtube',
                    displayName: message.authorDetails.displayName,
                    username: message.authorDetails.displayName,
                    messageText: youtubeMessageConverter.processMessage(message.snippet.displayMessage),
                    broadcaster: message.authorDetails.isChatOwner,
                    mod: message.authorDetails.isChatModerator,
                    profileImage: message.authorDetails.profileImageUrl,
                    timeInMillis: new Date(message.snippet.publishedAt).getTime()
                })
            }
            if (typeof chatDetails.offlineAt === 'undefined') {
                // We use Math.max here to limit requests to once per 10 seconds, which should be enough for 2 videos over 3 hours
                setTimeout(() => {
                    getPageResult(chatDetails.nextPageToken)
                }, Math.max(chatDetails.pollingIntervalMillis, YOUTUBE_MIN_WAIT_TIME));
            } else {
                console.debug('Cancelling calls for stream chat as it is offline.')
            }
        }).catch((error) => {
            console.error('Failed to fetch YouTube Messages', error)
            setTimeout(() => { getPageResult(pageToken) }, YOUTUBE_MIN_WAIT_TIME);
        })
    }
    getPageResult(null);
}

io.on('connection', (socket) => {
    if (!twitchIsAuthorized) {
        socket.emit('needsTwitchAuth', {
            clientId: twitchClientId,
            redirectUri: REDIRECT_URL
        });
    }
    socket.on('admin', () => {
        console.warn('ADMIN CONNECTED');
    })
    socket.on('reconnectTikTok', (data) => {
        console.info('Admin triggered TikTok connect', {username: data.username});
        initializeTikTok(data.username)
    });
    socket.on('youtubeConnect', async (data) => {
        // data.videoId
        const videoIds = data.videoId.split(',');
        for(let videoIndex in videoIds) {
            const videoId = videoIds[videoIndex];
            const lookupResult = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&key=${youtubeApiKey}&id=${videoId}`)
            if (lookupResult.ok) {
                const lookupData = await lookupResult.json();
                if (!lookupData.error) {
                    if (typeof lookupData.items !== 'undefined' && lookupData.items.length >= 1) {
                        const liveChatId = lookupData.items[0].liveStreamingDetails.activeLiveChatId;
                        subscribeToYouTubeChat(liveChatId);
                        try {
                            youtubeMessageConverter.instantiateBttvEmotes(lookupData.items[0].snippet.channelId)
                        } catch (e) {
                            console.error('Error loading BTTV Emotes for Channel', lookupData, e)
                        }
                    } else {
                        const message = `YouTube Live Stream ${videoId} not found`
                        console.warn(message, lookupData);
                        socket.emit('log', {message});
                    }
                } else {
                    const message = `YouTube ${videoId}: ${lookupData.error.code}: ${lookupData.error.errors[0].reason}`
                    console.warn(message);
                    socket.emit('log', {message});
                }
            } else {
                const message = `Could not fetch information for YouTube video ${data.videoId}`;
                console.warn(message, lookupResult);
                socket.emit('log', {message});
            }
        }
    })
    socket.on('requestBacklog', () => {
        for(let messageIndex in oldMessages) {
            socket.emit('chat', oldMessages[messageIndex]);
        }
    })
});

app.get('/oauth-authorize', async (req, res) => {
    if (twitchIsAuthorized) {
        res.send('Error already authorized');
    } else if (req.query.code) {
        twitchIsAuthorized = true;
        const tokenData = await exchangeCode(twitchClientId, twitchClientSecret, req.query.code, REDIRECT_URL);
        const TWITCH_CHANNEL_ID = await twitchAuthProvider.addUserForToken(tokenData);
        io.sockets.emit('twitchAuthorized');
        res.redirect('/admin.html');
        initializePostTwitchAuthorization(TWITCH_CHANNEL_ID);
    } else {
        res.send('Error no code');
    }
});
app.get('/twitchimage/:twitchUser', async (req, res) => {
    let userInfo = await twitchApiClient.users.getUserByNameBatched(req.params.twitchUser);
    if (userInfo === null) {
        res.code = 404;
    } else {
        res.redirect(userInfo.profilePictureUrl);
    }
});
app.use(express.static('pub'));

const port = process.env.PORT || 8082;
httpServer.listen(port);
