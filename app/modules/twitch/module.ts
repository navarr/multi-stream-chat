import {Module} from "../../framework/Module";
import {moduleRegistry} from "../../framework/ModuleRegistry";
import {badgeManager} from "./helper/BadgeManager";
import {ApiClient} from "@twurple/api";
import {logger} from "../../framework/Logger";
import {EventSubWsListener} from "@twurple/eventsub-ws";
import {ImageBadge} from "../../types/Badges";
import type {EventSubChannelChatMessageEvent} from "@twurple/eventsub-base/lib/events/EventSubChannelChatMessageEvent";
import {eventHandler} from "../../framework/EventHandler";
import {ChatMessageEvent, ChatMessageFx, SimpleMessage} from "./event/ChatMessageEvent";
import {TwitchMessageConverter} from "./helper/TwitchMessageConverter";
import {RefreshingAuthProvider} from "@twurple/auth";
import {configManager} from "../../framework/ConfigHandler";

class TwitchInitializer extends Module {
    public static MODULE_NAME: string = "twitch";
    private apiClient: ApiClient;

    public static getModuleName(): string {
        return TwitchInitializer.MODULE_NAME;
    }

    async initialize(config: any): Promise<void> {
        const authProvider = new RefreshingAuthProvider({clientId: configManager.get('TWITCH_CLIENT_ID'), clientSecret: configManager.get('TWITCH_CLIENT_SECRET')})
        this.apiClient = new ApiClient({authProvider});

        this.initializeConnection(configManager.get('TWITCH_CHANNEL_ID'))
    }

    shutdown(): void {
    }

    public async initializeConnection(channelId: string) {
        if (this.apiClient === undefined) {
            logger.error('Could not initialize Twitch connection, no ApiClient defined', {'channelId': channelId});
            return;
        }
        badgeManager.loadChannelTwitchBadges(this.apiClient, channelId);

        const messageConverter = new TwitchMessageConverter(channelId, this.apiClient);
        const twitchListener = new EventSubWsListener({apiClient: this.apiClient});
        twitchListener.start();

        twitchListener.onChannelChatMessage(channelId, channelId, (event: EventSubChannelChatMessageEvent) => {
            if (event.rewardId !== null) {
                // Don't show rewards - those should be handled separately.
                return;
            }

            const badges = this.getBadgesFromEvent(event);

            let messageEffect: ChatMessageFx = ChatMessageFx.NONE;
            switch (true) { // man, I miss PHP's match statement
                case event.messageText.startsWith("\u0001ACTION"):
                    messageEffect = ChatMessageFx.ACTION;
                    break;
                case event.messageType === 'channel_points_highlighted':
                    messageEffect = ChatMessageFx.HIGHLIGHT;
                    break;
                case event.messageType === 'power_ups_message':
                    messageEffect = ChatMessageFx.POWER_UP_EFFECT;
                    break;
                case event.messageType === 'power_ups_gigantified_emote':
                    messageEffect = ChatMessageFx.GIGANTIFIED_EMOTE;
                    break;
                case event.messageType === 'user_intro':
                    messageEffect = ChatMessageFx.INTRO;
                    break;
            }

            let parentMessage: SimpleMessage;
            if (event.parentMessageText) {
                parentMessage = {
                    displayName: event.parentMessageUserDisplayName,
                    username: event.parentMessageUserName,
                    messageText: event.parentMessageText
                }
            }

            eventHandler.submitEvent(new ChatMessageEvent(
                event.chatterName,
                event.chatterDisplayName,
                event.messageText,
                messageConverter.convertMessage(event.messageParts),
                badges,
                messageEffect,
                parentMessage
            ))
        });
    }

    private getBadgesFromEvent(event: EventSubChannelChatMessageEvent): ImageBadge[] {
        const badges: ImageBadge[] = [];
        for(let badgeId in event.badges) {
            badges.push(badgeManager.getBadge(badgeId, event.badges[badgeId]));
        }
        return badges;
    }
}

moduleRegistry.register(TwitchInitializer);