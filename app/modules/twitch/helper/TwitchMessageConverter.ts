import {ApiClient, HelixCheermoteList} from "@twurple/api";
import {
    EventSubChatMessageCheermotePart,
    EventSubChatMessagePart
} from "@twurple/eventsub-base/lib/events/common/EventSubChatMessage.external";

type BttvEmote = {
    id: string
    code: string
    imageType: string
    animated: boolean
    userId: string
    modifier: boolean
    width: undefined|number
    height: undefined|number
}

export class TwitchMessageConverter {
    bttvEmotes: Record<string, string> = {}
    channelId: string|null = null
    apiClient: ApiClient
    cheermoteList: HelixCheermoteList|null = null

    constructor(channelId: string, apiClient: ApiClient) {
        this.channelId = channelId;
        this.apiClient = apiClient;
        this.loadBttvEmotes(channelId);
        this.loadCheermotes();
    }

    convertMessage(messageParts: EventSubChatMessagePart[]): string {
        let messageHtml: string = '';

        for (let partIndex in messageParts) {
            const part = messageParts[partIndex];
            if (part.type === 'text' || part.type === 'mention') {
                messageHtml = messageHtml + part.text.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
            } else if (part.type === 'cheermote') {
                messageHtml = messageHtml + this.buildCheermoteImageTag(part);
            } else if (part.type === 'emote') {
                messageHtml = messageHtml + this.buildTwitchEmoteImageTag(part.emote.id, part.text);
            }
        }

        return this.replaceBttvEmotesInMessageHtml(messageHtml);
    }

    convertBitsMessage(rawMessage:  string): string {
        const cheerNames = this.cheermoteList.getPossibleNames().sort((a, b) => {
            // Sort by string length for when a name contains another possible name
            if (a.length > b.length) return -1;
            if (b.length > a.length) return 1;
            return 0
        })
        let convertedMessage: string = rawMessage
        for (let cheermoteIndex in cheerNames) {
            let name = cheerNames[cheermoteIndex],
                pattern = `${name}(\\d+)`
            convertedMessage = convertedMessage.replaceAll(new RegExp(pattern, 'gi'), (match, num) => {
                const displayInfo = this.cheermoteList.getCheermoteDisplayInfo(name, num, {
                    background: 'dark',
                    state: 'animated',
                    scale: '2'
                })
                return `<img src="${displayInfo.url}" alt=${name}"><span style="font-weight:bold;color:${displayInfo.color}">${num}</span>`
            })
        }
        return convertedMessage
    }

    buildCheermoteImageTag(part: EventSubChatMessageCheermotePart): string {
        if (this.cheermoteList === null) {
            return part.text; // They never loaded?
        }

        const cheermoteDisplay = this.cheermoteList.getCheermoteDisplayInfo(part.cheermote.prefix, part.cheermote.bits, {
            background: 'dark',
            state: 'animated',
            scale: '2'
        });

        return `<img src="${cheermoteDisplay.url}" alt="${part.cheermote.prefix}" /><span style="font-weight:bold;color:${cheermoteDisplay.color}">${part.cheermote.bits}</span>`;
    }

    buildTwitchEmoteImageTag(emoteId: string, alt: string): string {
        const BASE_URL = 'https://static-cdn.jtvnw.net/emoticons/v2/';

        return '<img src="' + BASE_URL + emoteId + '/default/dark/1.0" ' +
            'srcset="' + BASE_URL + emoteId + '/default/dark/1.0 28w, ' +
            BASE_URL + emoteId + '/default/dark/2.0 56w,' +
            BASE_URL + emoteId + '/default/dark/3.0 112w" alt="' + alt + '">';
    }

    async loadBttvEmotes(channelId: string) {
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

    async loadChannelBttvEmotes(channelId: string) {
        const bttvResult = await fetch('https://api.betterttv.net/3/cached/users/twitch/' + channelId);
        if (bttvResult.ok) {
            const bttvJson = await bttvResult.json();
            this.addBttvEmotes(bttvJson.sharedEmotes as BttvEmote[]);
            this.addBttvEmotes(bttvJson.channelEmotes as BttvEmote[]);
        } else {
            console.warn(bttvResult);
        }
    }

    addBttvEmotes(emotes: BttvEmote[]) {
        for (let emoteIndex in emotes) {
            const emoteCode = emotes[emoteIndex].code;
            this.bttvEmotes[emoteCode] = `https://cdn.betterttv.net/emote/${emotes[emoteIndex].id}/2x`;
        }
    }

    replaceBttvEmotesInMessageHtml(messageHtml: string): string {
        for (let emoteCode in this.bttvEmotes) {
            const image = this.bttvEmotes[emoteCode];
            messageHtml = messageHtml.replaceAll(emoteCode, `<img src="${image}" alt="${emoteCode}" />`);
        }
        return messageHtml;
    }

    async loadCheermotes() {
        this.cheermoteList = await this.apiClient.bits.getCheermotes(this.channelId);
    }
}