import {IncomingMessage} from "http";

require('dotenv').config();

const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io');
const {PronounDatabase} = require('./pronounDatabase');
const {TwitchMessageConverter} = require('./twitchMessageConverter');
const {RefreshingAuthProvider, exchangeCode} = require('@twurple/auth');
const {ApiClient} = require("@twurple/api");
const {EventSubWsListener} = require("@twurple/eventsub-ws");
const {YoutubeMessageProcessor} = require('./youtubeMessageProcessor')
const {TITSConnectionWrapper} = require('./titsConnectionWrapper')
const bodyParser = require('body-parser');
import {FollowEvent, LikeEvent, ShareEvent, SubscribeEvent, CommentEvent, GiftEvent} from "@tiktoklive/types";
import {EulerConnectionWrapper} from "./eulerConnectionWrapper";

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

const titsConnection = new TITSConnectionWrapper(process.env.VNYAN_URL);

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
    io.sockets.emit('log', {message: `Twitch is now authorized for ${TWITCH_CHANNEL_ID}`});

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
            console.log('Sub', e);
            io.sockets.emit('subscribe', Object.assign({}, basicData, {
                tier: e.tier / 1000,
                months: 1,
                streak: 1,
                isPrime: e.isPrime
            }));
        } else if (e.type === 'resub') {
            console.log('Resub', e);
            io.sockets.emit('subscribe', Object.assign({}, basicData, {
                tier: e.tier / 1000,
                months: e.cumulativeMonths,
                streak: e.streakMonths,
                isPrime: e.isPrime
            }));
        } else if (e.type === 'community_sub_gift') {
            console.log('Community Sub Gift', e);
            io.sockets.emit('community_gift', Object.assign({}, basicData, {
                tier: e.tier / 1000,
                amount: e.amount,
                totalGifts: e.cumulativeAmount
            }));
        } else if (e.type === 'sub_gift') {
            console.log('Sub Gift', e);
            io.sockets.emit('sub_gift', Object.assign({}, basicData, {
                tier: e.tier / 1000,
                months: 1,
                streak: 1,
                isPrime: false,
                totalGifts: e.cumulativeAmount,
                recipientDisplayName: e.recipientDisplayName,
                recipientUserName: e.recipientName
            }));
        } else if (e.type === 'gift_paid_upgrade') {
            console.log('Gift Paid Upgrade', e);
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
            console.log('Prime Paid Upgrade', e);
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
            console.log('Pay it Forward', e);
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
            console.log('Blank type?', e);
        } else {
            console.log('Unhandled Event Type', e.type, e);
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
let tikTok;
const eulerTiktoks = {};
function initializeTikTok(TIKTOK_CHANNEL) {
    let eulerTiktok;
    if (typeof eulerTiktoks[TIKTOK_CHANNEL] === 'undefined') {
        eulerTiktok = new EulerConnectionWrapper(process.env.EULER_KEY, TIKTOK_CHANNEL);
        eulerTiktoks[TIKTOK_CHANNEL] = eulerTiktok;
        initializeTikTokThroughEuler(eulerTiktok, TIKTOK_CHANNEL);
    }
    eulerTiktok = eulerTiktoks[TIKTOK_CHANNEL];
    eulerTiktok.connect();

    return;
    // const tiktokOptions = {
    //     enableExtendedGiftInfo: true,
    //     clientParams: {"app_language":"en-US","device_platform":"web"},
    //     requestOptions:{timeout: 10000}
    // }
    // if (process.env.TIKTOK_SESSION_ID) {
    //     tiktokOptions['sessionId'] = process.env.TIKTOK_SESSION_ID
    // }
    // if (process.env.TIKFINITY_URL) {
    //     tikTok = new TikfinityConnectionWrapper(process.env.TIKFINITY_URL);
    // } else {
    //     tikTok = new TikTokConnectionWrapper(TIKTOK_CHANNEL, tiktokOptions, false, process.env.EULER_KEY);
    // }
    // initializeTiktokListeners(tikTok)
    // tikTok.connect()
}

function initializeTikTokThroughEuler(eulerTiktok, channelName) {
    function assembleBadges(user) {
        const badges = [];
        for (let badgeIncrement in user.badgeList) {
            const badge = user.badgeList[badgeIncrement];
            if (badge.displayType === 'BADGEDISPLAYTYPE_COMBINE') {
                badges.push({
                    type: 'wrappedImage',
                    text: badge.combine.str ?? '',
                    background: badge.combine.background,
                    backgroundDark: badge.combine.backgroundDarkMode,
                    image: badge.combine.icon.urlList[0]
                })
            }
        }
        return badges;
    }

    eulerTiktok.on('gift', (data: GiftEvent) => {
        const giftName = data.gift.name.trim();
        console.log("Gift Name: '" + giftName + "'");
        if (data.repeatEnd || typeof data.groupId === 'undefined') { // no group, no combo
            let diamondCount = data.gift.diamondCount * data.repeatCount;
            io.sockets.emit('gift', {
                source: 'tiktok',
                displayName: data.user.nickname,
                username: data.user.displayId,
                diamondCount: diamondCount,
                giftName: giftName,
                giftAmount: data.repeatCount,
                giftImage: data.gift.image.urlList[0],
                badges: assembleBadges(data.user)
            });
        }
        if (giftName === 'Heart Me') {
            titsConnection.throwItem('heart', 10);
            titsConnection.throwItem('headpat', 1);
        } else if (giftName === 'Finger Heart' && data.repeatEnd) {
            titsConnection.throwItem('headpat', 1);
        } else if (giftName === 'Tiny Diny' && data.repeatEnd) {
            titsConnection.throwItem('bonk', 1);
        } else {
            titsConnection.throwItem('coin', 1);
        }
    });

    eulerTiktok.on('subscribe', (data: SubscribeEvent) => {
        io.sockets.emit('subscribe', {
            type: 'subscribe',
            source: 'tiktok',
            displayName: data.user.nickname,
            username: data.user.displayId
        });
    });

    eulerTiktok.on('like', (data: LikeEvent) => {
        io.sockets.emit('like', {
            type: 'react',
            reactType: 'like',
            source: 'tiktok',
            displayName: data.user.nickname,
            username: data.user.displayId
        })
    });

    eulerTiktok.on('follow', (data: FollowEvent) => {
        io.sockets.emit('follow', {
            source: 'tiktok',
            displayName: data.user.nickname,
            username: data.user.displayId
        })
    })

    eulerTiktok.on('share', (data: ShareEvent) => {
        io.sockets.emit('share', {
            source: 'tiktok',
            displayName: data.user.nickname,
            username: data.user.displayId
        })
    })

    eulerTiktok.on('connect', () => {
        io.sockets.emit('log', {message: `Connected to Euler TikTok service for ${channelName}`});
    });

    eulerTiktok.on('disconnect', () => {
        io.sockets.emit('log', {message: `Disconnected from Euler Tiktok Service for ${channelName}`});
    });

    eulerTiktok.on('chat', (data: CommentEvent) => {
        let comment = typeof data.content !== 'undefined' ? data.content : '';

        let startLength = 0;
        for (let emoteIndex in data.emotesList) {
            const emote = data.emotesList[emoteIndex];
            const imageString = `<img src="${emote.emote.image.urlList[0]}">`;
            startLength += imageString.length;
            comment = comment.substring(0, emote.index + startLength) + imageString + comment.substring(emote.index + startLength);
        }

        const badges = [];
        let isMod = false;

        /**
         * Badges:
         * - Moderator
         * - Gift Level 23
         * - Team Level II
         * - FOXO (subscriber)
         *
         * Badge Data BADGEDISPLAYTYPE_TEXT { defaultPattern: 'Moderator' } undefined undefined
         * Badge Data BADGEDISPLAYTYPE_IMAGE undefined { <-- Subscriber, but only the image?
         *   image: {
         *     urlList: [
         *       'https://p16-webcast.tiktokcdn-us.com/webcast-oci-tx/sub_49e827679d0ab0fc7c3e0357e5d7d35be5c5d4d4b61f748810747aeaeed8703c~tplv-obj.image',
         *       'https://p19-webcast.tiktokcdn-us.com/webcast-oci-tx/sub_49e827679d0ab0fc7c3e0357e5d7d35be5c5d4d4b61f748810747aeaeed8703c~tplv-obj.image'
         *     ],
         *     extras: 'webcast-oci-tx/sub_49e827679d0ab0fc7c3e0357e5d7d35be5c5d4d4b61f748810747aeaeed8703c'
         *   }
         * } undefined
         * Badge Data BADGEDISPLAYTYPE_COMBINE undefined undefined { <-- GIFT LEVEL
         *   icon: {
         *     urlList: [
         *       'https://p16-webcast.tiktokcdn.com/webcast-va/grade_badge_icon_lite_lv20_v1.png~tplv-obj.image',
         *       'https://p19-webcast.tiktokcdn.com/webcast-va/grade_badge_icon_lite_lv20_v1.png~tplv-obj.image'
         *     ],
         *     extras: 'webcast-va/grade_badge_icon_lite_lv20_v1.png'
         *   },
         *   str: '23',
         *   profileCardPanel: { projectionConfig: { icon: {} }, profileContent: {} },
         *   background: { image: {}, backgroundColorCode: '#B3475AFF' },
         *   backgroundDarkMode: { image: {}, backgroundColorCode: '#B3475AFF' },
         *   publicScreenShowStyle: 14,
         *   personalCardShowStyle: 15
         * }
         * Badge Data BADGEDISPLAYTYPE_COMBINE undefined undefined { <!-- Team Level heart
         *   icon: {
         *     urlList: [
         *       'https://p16-webcast.tiktokcdn.com/webcast-va/fans_badge_icon_lv10_v0.png~tplv-obj.image',
         *       'https://p19-webcast.tiktokcdn.com/webcast-va/fans_badge_icon_lv10_v0.png~tplv-obj.image'
         *     ],
         *     extras: 'webcast-va/fans_badge_icon_lv10_v0.png'
         *   },
         *   str: 'Ⅱ',
         *   profileCardPanel: { projectionConfig: { icon: {} }, profileContent: {} },
         *   background: { image: {}, backgroundColorCode: '#A6D75139' },
         *   backgroundDarkMode: { image: {}, backgroundColorCode: '#A6D75139' },
         *   publicScreenShowStyle: 14,
         *   personalCardShowStyle: 15
         * }
         * Badge Data BADGEDISPLAYTYPE_COMBINE undefined undefined { <!-- Subscriber
         *   icon: {
         *     urlList: [
         *       'https://p16-webcast.tiktokcdn-us.com/webcast-oci-tx/sub_49e827679d0ab0fc7c3e0357e5d7d35be5c5d4d4b61f748810747aeaeed8703c~tplv-obj.image',
         *       'https://p19-webcast.tiktokcdn-us.com/webcast-oci-tx/sub_49e827679d0ab0fc7c3e0357e5d7d35be5c5d4d4b61f748810747aeaeed8703c~tplv-obj.image'
         *     ],
         *     extras: 'webcast-oci-tx/sub_49e827679d0ab0fc7c3e0357e5d7d35be5c5d4d4b61f748810747aeaeed8703c'
         *   },
         *   str: 'FOXO',
         *   background: { image: {}, backgroundColorCode: '#99EF7300' },
         *   publicScreenShowStyle: 14,
         *   personalCardShowStyle: 14
         * }
         * Badge Data BADGEDISPLAYTYPE_COMBINE undefined undefined { <!-- Moderator
         *   icon: {
         *     urlList: [
         *       'https://p16-webcast.tiktokcdn.com/webcast-va/moderater_badge_icon.png~tplv-obj.image',
         *       'https://p19-webcast.tiktokcdn.com/webcast-va/moderater_badge_icon.png~tplv-obj.image'
         *     ],
         *     extras: 'webcast-va/moderater_badge_icon.png'
         *   },
         *   text: {},
         *   background: { image: {}, backgroundColorCode: '#803F3F3F' },
         *   backgroundDarkMode: { image: {}, backgroundColorCode: '#803F3F3F' },
         *   iconAutoMirrored: true,
         *   backgroundAutoMirrored: true,
         *   publicScreenShowStyle: 12,
         *   personalCardShowStyle: 14
         * }
         */

        sendMessage({
            type: 'chat',
            badges: assembleBadges(data.user),
            source: 'tiktok',
            displayName: data.user.nickname,
            username: data.user.displayId,
            messageText: comment,
            profileImage: data.user.avatarThumb.urlList[0]
        })
    })
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
                titsConnection.throwItem("heart", 10);
            }
        } else {
            try {
                //titsConnection.throwItem(process.env.ROSE_ITEM, 1);
                titsConnection.throwItem("coin", 1);
            } catch(e) {
                console.warn(e)
            }
        }
    })

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
        io.sockets.emit('log', {message: 'Connected to TikTok'});
    });
    tikTok.connection.on('disconnect', (e) => {
        io.sockets.emit('log', {message: 'TikTok disconnected.'})
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
async function subscribeToYouTubeChat(liveChatId, videoId) {
    io.sockets.emit('log', {message: `Starting to poll for messages for YT video ${videoId}`});

    // Get existing messages and begin polling
    let getResultAttempts = 0;
    async function getPageResult(pageToken) {
        if (getResultAttempts >= 10) {
            console.error(`Permanently Failed to get chat messages for ${liveChatId}`);
            io.sockets.emit('log', {message: `No longer polling for new messages for YT video ${videoId}`});
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
                        subscribeToYouTubeChat(liveChatId, videoId);
                        try {
                            youtubeMessageConverter.instantiateBttvEmotes(lookupData.items[0].snippet.channelId)
                        } catch (e) {
                            socket.emit('log', {message: `Unable to pull BTTV emotes for the requested channel, video ID: ${videoId}`})
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

app.use(bodyParser.json());

const tiltifyRewards = {
    'fb636d07-97cd-4db1-87a9-0499666ca76e': 'Ask Me Anything',
    '325f729b-d18c-4688-92a4-d1abe9e93cb6': 'Cat Cam Treat',
    '2e5777d8-6893-45e7-b47b-8ef5253d484e': 'Handwritten Thank-you Note',
    'b1d16cf1-4e1d-4c63-8be0-c5ea9f9ad7eb': 'Beanboozled Bean',
    '5d65c469-abb8-493d-a4af-0140b4af3090': 'Nyavarr posts your tweet',
    'fa5e470c-d487-48ab-bed9-3c910e721f30': 'Tier List'
}

const tiltifyPolls = {
    'a540e5e2-020f-4f3f-823a-f5d165494310': {
        name: 'What type of animal is Nyavarr?',
        options: {
            '2d43f8fc-6474-4557-9ced-572642b4fd60': 'A shape-shifting fox',
            '082c0071-8152-4a90-9c05-d608fd7e7f94': 'A deer'
        }
    }
}


app.post('/tiltify', async (req: IncomingMessage, res) => {
    if (req?.body?.meta?.event_type === 'public:direct:donation_updated' || req?.body?.meta?.event_type === 'private:direct:donation_updated') {
        const charityEvent = req.body;
        const tempDate = new Date(charityEvent.meta.generated_at);

        const rewards = [];
        let poll = null;

        for(let claimIndex in charityEvent.data.reward_claims) {
            const claim = charityEvent.data.reward_claims[claimIndex];
            rewards.push({
                name: tiltifyRewards[claim.reward_id] ?? 'Unknown Reward',
                qty: claim.quantity,
                answer: claim?.custom_question
            });
        }

        if (charityEvent.data.poll_id) {
            poll = {
                question: tiltifyPolls[charityEvent.data.poll_id]?.name ?? 'Unknown Question',
                answer: tiltifyPolls[charityEvent.data.poll_id]?.options[charityEvent.data.poll_option_id] ?? 'Unknown Answer'
            }
        }

        io.sockets.emit('charity', {
            source: 'tiltify',
            charity: 'Tiltify',
            displayName: charityEvent.data.donor_name,
            username: charityEvent.data.donor_name,
            amount: charityEvent.data.amount,
            message: charityEvent.data.donor_comment,
            timeInMillis: tempDate.getTime(),
            rewards,
            poll
        });
    }

    if (req?.body?.meta?.event_type === 'public:direct:fact_updated') {
        const charityEvent = req.body.data;

        io.sockets.emit('charity_total', {
            source: 'tiltify',
            charity: 'Tiltify',
            total: charityEvent.total_amount_raised
        })
    }

    res.code = 204;
    res.send();
})
app.use(express.static('pub'));

const port = process.env.PORT || 8082;
httpServer.listen(port);
