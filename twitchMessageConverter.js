/**
 *
 * @param {EventSubChatMessagePart[]} message
 */

class TwitchMessageConverter {
    constructor(channelId, apiClient) {
        this.bttvEmotes = {};
        this.cheerMotes = {};
        this.channelId = channelId;
        this.apiClient = apiClient;
        this.cheermoteList = null;
        this.loadBttvEmotes(channelId);
        this.loadCheermotes();
    }

    convertMessage(messageParts) {
        let messageHtml = '';

        for(let partIndex in messageParts) {
            const part = messageParts[partIndex];
            if (part.type === 'text' || part.type === 'mention') {
                messageHtml = messageHtml + part.text;
            } else if (part.type === 'cheermote') {
                messageHtml = messageHtml + this.buildCheermoteImageTag(part);
            } else if (part.type === 'emote') {
                messageHtml = messageHtml + this.buildTwitchEmoteImageTag(part.emote.id, part.text);
            }
        }

        return this.replaceBttvEmotesInMessageHtml(messageHtml);
    }

    convertBitsMessage(rawMessage) {
        const cheerNames = this.cheermoteList.getPossibleNames()
        let convertedMessage = rawMessage
        for(let cheermoteIndex in cheerNames) {
            let name = cheerNames[cheermoteIndex],
                pattern = `${name}(\\d+)`
            convertedMessage = convertedMessage.replaceAll(new RegExp(pattern, 'g'), (match, num) => {
                const displayInfo = this.cheermoteList.getCheermoteDisplayInfo(name, num, {background: 'dark', state: 'animated', scale: '2'})
                console.debug('Cheer Found in message', name, num, displayInfo)
                return `<img src="${displayInfo.url}" alt=${name}"><span style="font-weight:bold;color:${displayInfo.color}">${num}</span>`
            })
        }
        return convertedMessage
    }

    buildCheermoteImageTag(part) {
        if (this.cheermoteList === null) {
            return part.text; // They never loaded?
        }

        const cheermoteDisplay = this.cheermoteList.getCheermoteDisplayInfo(part.prefix, part.bits, {
            background: 'dark',
            state: 'animated',
            scale: '2'
        });

        return `<img src="${cheermoteDisplay.url}" alt="${part.prefix}" /><span style="font-weight:bold;color:${cheermoteDisplay.color}">${part.bits}</span>`;
    }

    buildTwitchEmoteImageTag(emoteId, alt) {
        const BASE_URL = 'https://static-cdn.jtvnw.net/emoticons/v2/';

        return '<img src="' + BASE_URL + emoteId + '/default/dark/1.0" ' +
            'srcset="' + BASE_URL + emoteId + '/default/dark/1.0 28w, ' +
            BASE_URL + emoteId + '/default/dark/2.0 56w,' +
            BASE_URL + emoteId + '/default/dark/3.0 112w" alt="' + alt + '">';
    }

    async loadBttvEmotes(channelId) {
        // await this.loadGlobalBttvEmotes();
        this.loadChannelBttvEmotes(channelId);
    }
    async loadGlobalBttvEmotes() {
        const bttvResult = await fetch('https://api.betterttv.net/3/cached/emotes/global');
        if (bttvResult.ok) {
            const bttvJson = await bttvResult.json();
            this.addBttvEmotes(bttvJson);
        } else {
            console.warn(bttvResult);
        }
    }
    async loadChannelBttvEmotes(channelId) {
        const bttvResult = await fetch('https://api.betterttv.net/3/cached/users/twitch/' + channelId);
        if (bttvResult.ok) {
            const bttvJson = await bttvResult.json();
            this.addBttvEmotes(bttvJson.sharedEmotes);
            this.addBttvEmotes(bttvJson.channelEmotes);
        } else {
            console.warn(bttvResult);
        }
    }
    addBttvEmotes(emotes) {
        for(let emoteIndex in emotes) {
            const emoteCode = emotes[emoteIndex].code;
            const emoteImageUrl = `https://cdn.betterttv.net/emote/${emotes[emoteIndex].id}/2x`;
            this.bttvEmotes[emoteCode] = emoteImageUrl;
        }
    }

    replaceBttvEmotesInMessageHtml(messageHtml) {
        for(let emoteCode in this.bttvEmotes) {
            const image = this.bttvEmotes[emoteCode];
            messageHtml = messageHtml.replaceAll(emoteCode, `<img src="${image}" alt="${emoteCode}" />`);
        }
        return messageHtml;
    }

    async loadCheermotes() {
        this.cheermoteList = await this.apiClient.bits.getCheermotes(this.channelId);
    }
}

module.exports = {TwitchMessageConverter};