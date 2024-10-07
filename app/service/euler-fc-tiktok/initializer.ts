import {Module} from "../../framework/Module";
import {connectionHandler} from "./connectionHandler";
import {logger} from "../../framework/Logger";
import {ChatMessageEvent} from "./event/ChatMessageEvent";
import {Badge, BadgeType, ImageAndTextBadge, ImageBadge} from "../../types/Badges";
import {Color, RedGreenBlueAlpha} from "../../types/Color";
import {BadgeStruct} from "@tiktoklive/types";
import {eventHandler} from "../../framework/EventHandler";
import {configManager} from "../../framework/ConfigHandler";

/**
 * This class is responsible for initializing the TikTok module
 */
export class TiktokInitializer implements Module {
    moduleName: string = "TikTok";

    initialize(): void {
        // Create Connection Handler
        // Add Listener for Admin-triggered events
        // Send Events to EventBus

        // Testing Only
        this.setupConnection(configManager.get('TEST_TIKTOK_USER'));
    }

    setupConnection(username: string): void {
        const socket = connectionHandler.getConnection(username);
        socket.on('message', (rawMessage: string) => {
            let message;
            try {
                message = JSON.parse(rawMessage);
            } catch {
                logger.info('Could not parse raw message from Euler FC', rawMessage);
                return;
            }

            try {
                if (typeof message.type === 'undefined') {
                    logger.info('Euler FC Message did not have a type', message);
                    return;
                }
                if (message.type !== 'tiktok_event') {
                    logger.info('Euler FC Message was not a tiktok event', message);
                    return;
                }
                if (typeof message.name === 'undefined') {
                    logger.info('Euler FC Message did not have an event type associated', message);
                    return;
                }

                switch (message.name) {
                    case 'CommentEvent':
                        const tiktokComment = new ChatMessageEvent();
                        tiktokComment.displayName = message.data.user.nickname;
                        tiktokComment.username = message.data.user.displayId;
                        tiktokComment.messageText = this.assembleMessageText(message.data.content, message.data.emotesList);
                        tiktokComment.messageHtml = this.assembleMessageHtml(message.data.content, message.data.emotesList);
                        if (typeof message.data.user.badgeList !== 'undefined') {
                            try {
                                tiktokComment.badges = this.assembleBadges(message.data.user.badgeList);
                            } catch (e) {
                                logger.error('Error Assembling Badges for Chat Message', JSON.stringify(message.data.user.badgeList), e);
                            }
                        }
                        eventHandler.submitEvent(tiktokComment);
                }
            } catch (e) {
                logger.error('Unknown error', e);
            }
        })
    }

    private assembleMessageText(text: string, emoteList): string {
        let comment = text,
            startLength = 0;

        for (let emoteIndex in emoteList) {
            const emote = emoteList[emoteIndex];
            const imageString = emote.emote.emoteId;
            startLength += imageString.length;
            comment = comment.substring(0, emote.index + startLength) + imageString + comment.substring(emote.index + startLength);
        }

        return comment;
    }

    private assembleMessageHtml(text: string, emoteList): string {
        let comment = text,
            startLength = 0;

        for (let emoteIndex in emoteList) {
            const emote = emoteList[emoteIndex];
            const imageString = `<img src="${emote.emote.image.urlList[0]}">`;
            startLength += imageString.length;
            comment = comment.substring(0, emote.index + startLength) + imageString + comment.substring(emote.index + startLength);
        }

        return comment;
    }

    private assembleBadges(badgeList: BadgeStruct[]): Array<Badge> {
        const badges = new Array<Badge>();
        badgeList.forEach((rawBadge: BadgeStruct) => {
            let badge;
            if (rawBadge.displayType === 'BADGEDISPLAYTYPE_COMBINE' && typeof rawBadge.combine.str !== 'undefined' && rawBadge.combine.str.length) {
                badge = new ImageAndTextBadge();
                badge.displayText = rawBadge.combine.str;
                badge.background = new Color();
                badge.background.lightMode = this.convertTikTokColorToRgba(rawBadge.combine.background.backgroundColorCode)
                if (typeof rawBadge.combine.backgroundDarkMode !== 'undefined') {
                    badge.background.darkMode = this.convertTikTokColorToRgba(rawBadge.combine.backgroundDarkMode.backgroundColorCode)
                } else {
                    badge.background.darkMode = badge.background.lightMode;
                }
                badge.imageUrl = rawBadge.combine.icon.urlList[0];
            } else if (rawBadge.displayType === 'BADGEDISPLAYTYPE_COMBINE') {
                badge = new ImageBadge();
                badge.imageUrl = rawBadge.combine.icon.urlList[0];
            }
            badges.push(badge);
        })

        return badges;
    }

    private convertTikTokColorToRgba(tiktokColor: string) {
        const rgba = new RedGreenBlueAlpha();
        rgba.red = parseInt(tiktokColor.substring(3, 5), 16);
        rgba.green = parseInt(tiktokColor.substring(5, 7), 16);
        rgba.blue = parseInt(tiktokColor.substring(7, 9), 16);
        rgba.alpha = parseInt(tiktokColor.substring(1, 3), 16);
        return rgba;
    }

    shutdown(): void {
        connectionHandler.closeAll();
    }
}