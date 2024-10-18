import {Module} from "../../framework/Module";
import {moduleRegistry} from "../../framework/ModuleRegistry";
import {badgeManager} from "./helper/BadgeManager";
import {ApiClient} from "@twurple/api";
import {logger} from "../../framework/Logger";
import {EventSubWsListener} from "@twurple/eventsub-ws";
import {ImageBadge} from "../../types/Badges";
import type {EventSubChannelChatMessageEvent} from "@twurple/eventsub-base/lib/events/EventSubChannelChatMessageEvent";
import {eventHandler} from "../../framework/EventHandler";
import {ChatMessageEvent} from "./event/ChatMessageEvent";
import {TwitchMessageConverter} from "./helper/TwitchMessageConverter";

class TwitchInitializer extends Module {
    public static MODULE_NAME: string = "twitch";
    private apiClient: ApiClient;

    public static getModuleName(): string {
        return TwitchInitializer.MODULE_NAME;
    }

    initialize(config: any): void {
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

            eventHandler.submitEvent(new ChatMessageEvent(
                event.chatterName,
                event.chatterDisplayName,
                event.messageText,
                messageConverter.convertMessage(event.messageParts),
                event.messageText.startsWith("\u0001ACTION"),
                badges
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