import {Module} from "../../framework/Module";
import {connectionHandler} from "./connectionHandler";
import {logger} from "../../framework/Logger";
import {ChatMessageEvent} from "./event/ChatMessageEvent";
import {Badge, ImageAndTextBadge, ImageBadge} from "../../types/Badges";
import {Color, RedGreenBlueAlpha} from "../../types/Color";
import {
    BadgeStruct,
    BadgeStructBadgeDisplayType,
    CommentEvent as LibCommentEvent,
    JoinEvent as LibJoinEvent,
    LikeEvent as LibLikeEvent,
    FollowEvent as LibFollowEvent,
    SubscribeEvent as LibSubscribeEvent,
    GiftEvent as LibGiftEvent,
    WebcastChatMessageEmoteWithIndex,
} from "../../types/TikTokTypes";
import {eventHandler} from "../../framework/EventHandler";
import {configManager} from "../../framework/ConfigHandler";
import {JoinEvent} from "./event/JoinEvent";
import {LikeEvent} from "./event/LikeEvent";
import {FollowEvent} from "./event/FollowEvent";
import {SubscribeEvent} from "./event/SubscribeEvent";
import {ComboGiftEvent, GiftImage, GiftSummaryEvent} from "./event/GiftEvent";
import {moduleRegistry} from "../../framework/ModuleRegistry";

/**
 * This class is responsible for initializing the TikTok module
 */
class TiktokInitializer implements Module {
    public static MODULE_NAME: string = "euler-fc-tiktok";
    giftGroups: Record<string, number> = {};

    initialize(): void {
        // Testing Only
        this.setupConnection(configManager.get('TEST_TIKTOK_USER'));
    }

    public static getModuleName(): string {
        return TiktokInitializer.MODULE_NAME;
    }

    setupConnection(username: string): void {
        const socket = connectionHandler.getConnection(username);
        socket.on('message', (rawMessage: string) => {
            let message: { type: string | undefined, name: string | undefined, data: object };
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
                        this.handleCommentEvent(message.data as LibCommentEvent);
                        break;

                    case 'JoinEvent':
                        this.handleJoinEvent(message.data as LibJoinEvent);
                        break;

                    case 'LikeEvent':
                        this.handleLikeEvent(message.data as LibLikeEvent);
                        break;

                    case 'FollowEvent':
                        this.handleFollowEvent(message.data as LibFollowEvent);
                        break;

                    case 'SubscribeEvent':
                        this.handleSubscribeEvent(message.data as LibSubscribeEvent);
                        break;

                    case 'GiftEvent':
                        this.handleGiftEvent(message.data as LibGiftEvent);
                        break;
                }
            } catch (e) {
                logger.error(e);
            }
        })
    }

    private handleGiftEvent(event: LibGiftEvent) {
        if (event.gift === undefined) {
            console.warn('Gift not defined during gift event', JSON.stringify(event));
            return;
        }
        const groupId = event.groupId;
        if (groupId === undefined) { // This was a single gift that cannot be repeated
            // Throw both events
            eventHandler.submitEvent(new ComboGiftEvent(
                event.gift.name.trim(),
                event.gift.diamondCount,
                event.user?.nickname ?? 'Anonymous',
                event.user?.displayId ?? 'Anonymous',
                new GiftImage(event.gift.image?.urlList ? event.gift.image.urlList[0] : 'data:image/png,', event.gift.name.trim()),
                event.repeatCount
            ));
            eventHandler.submitEvent(new GiftSummaryEvent(
                event.gift.name.trim(),
                event.gift.diamondCount,
                event.user?.nickname ?? 'Anonymous',
                event.user?.displayId ?? 'Anonymous',
                new GiftImage(event.gift.image?.urlList ? event.gift.image.urlList[0] : 'data:image/png,', event.gift.name.trim()),
                event.repeatCount
            ));
        } else if (event.repeatEnd && this.giftGroups.hasOwnProperty(groupId)) {
            // If it is repeat end, and the group was previously defined - throw only the summary event
            eventHandler.submitEvent(new GiftSummaryEvent(
                event.gift.name.trim(),
                event.gift.diamondCount * event.repeatCount,
                event.user?.nickname ?? 'Anonymous',
                event.user?.displayId ?? 'Anonymous',
                new GiftImage(event.gift.image?.urlList ? event.gift.image.urlList[0] : 'data:image/png,', event.gift.name.trim()),
                event.repeatCount
            ))
        } else if (event.repeatEnd && !this.giftGroups.hasOwnProperty(groupId)) {
            // If it is repeat end and the group was not previously defined, throw both events using the total amount for the combo event
            eventHandler.submitEvent(new ComboGiftEvent(
                event.gift.name.trim(),
                event.gift.diamondCount * event.repeatCount,
                event.user?.nickname ?? 'Anonymous',
                event.user?.displayId ?? 'Anonymous',
                new GiftImage(event.gift.image?.urlList ? event.gift.image.urlList[0] : 'data:image/png,', event.gift.name.trim()),
                event.repeatCount,
                event.repeatCount
            ));
            eventHandler.submitEvent(new GiftSummaryEvent(
                event.gift.name.trim(),
                event.gift.diamondCount * event.repeatCount,
                event.user?.nickname ?? 'Anonymous',
                event.user?.displayId ?? 'Anonymous',
                new GiftImage(event.gift.image?.urlList ? event.gift.image.urlList[0] : 'data:image/png,', event.gift.name.trim()),
                event.repeatCount
            ));
        } else {
            // Otherwise throw just a combo event

            // We don't always get 1 event per combo press.  So we have to track how many have been sent to determine the
            // new amount of gifts
            let sentThisEvent = 1;
            if (this.giftGroups.hasOwnProperty(groupId)) {
                sentThisEvent = event.repeatCount - this.giftGroups[groupId];
            } else {
                sentThisEvent = event.repeatCount;
            }

            this.giftGroups[groupId] = event.repeatCount;
            eventHandler.submitEvent(new ComboGiftEvent(
                event.gift.name.trim(),
                event.gift.diamondCount,
                event.user?.nickname ?? 'Anonymous',
                event.user?.displayId ?? 'Anonymous',
                new GiftImage(event.gift.image?.urlList ? event.gift.image.urlList[0] : 'data:image/png,', event.gift.name.trim()),
                event.repeatCount,
                sentThisEvent
            ));
        }
        if (event.groupCount > 1) {
            console.log('Gift with groupCount > 1', {
                'Name': event.gift.name.trim(),
                'Group ID': event.groupId,
                'Group Count': event.groupCount,
                'Per Gift Diamonds': event.gift.diamondCount,
                'Diamonds': event.gift.diamondCount,
                'Repeat Count': event.repeatCount,
                'Combo Count': event.comboCount,
                'Finished?': event.repeatEnd,
            })
        }
    }

    private handleSubscribeEvent(event: LibSubscribeEvent) {
        eventHandler.submitEvent(new SubscribeEvent(
            event.user.nickname,
            event.user.displayId,
            event.subMonth
        ));
    }

    private handleFollowEvent(event: LibFollowEvent) {
        eventHandler.submitEvent(new FollowEvent(
            event.user.nickname,
            event.user.displayId
        ));
    }

    private handleLikeEvent(event: LibLikeEvent) {
        eventHandler.submitEvent(new LikeEvent(
            event.user.nickname,
            event.user.displayId,
            event.count
        ));
    }

    private handleJoinEvent(event: LibJoinEvent) {
        eventHandler.submitEvent(new JoinEvent(
            event.user.nickname,
            event.user.displayId
        ));
    }

    private handleCommentEvent(event: LibCommentEvent) {
        let badges: Badge[] = [];
        if (typeof event.user.badgeList !== 'undefined') {
            try {
                badges = this.assembleBadges(event.user.badgeList);
            } catch (e) {
                logger.error('Error Assembling Badges for Chat Message', JSON.stringify(event.user.badgeList), e);
            }
        }
        eventHandler.submitEvent(new ChatMessageEvent(
            event.user.nickname,
            event.user.displayId,
            this.assembleMessageText(event.content, event.emotesList),
            this.assembleMessageHtml(event.content, event.emotesList),
            badges
        ));
    }

    private assembleMessageText(text: string = '', emoteList: WebcastChatMessageEmoteWithIndex[]): string {
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

    private assembleMessageHtml(text: string, emoteList: WebcastChatMessageEmoteWithIndex[]): string {
        let comment = text,
            startLength = 0;

        for (let emoteIndex in emoteList) {
            const emote = emoteList[emoteIndex];
            const imageString = `<img src="${emote.emote.image.urlList[0]}" alt="${emote.emote.emoteId}">`;
            startLength += imageString.length;
            comment = comment.substring(0, emote.index + startLength) + imageString + comment.substring(emote.index + startLength);
        }

        return comment;
    }

    private assembleBadges(badgeList: BadgeStruct[]): Array<Badge> {
        const badges = new Array<Badge>();
        badgeList.forEach((rawBadge: BadgeStruct) => {
            let badge;
            if (rawBadge.displayType === BadgeStructBadgeDisplayType.BADGEDISPLAYTYPE_COMBINE && typeof rawBadge.combine.str !== 'undefined' && rawBadge.combine.str.length) {
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
            } else if (rawBadge.displayType === BadgeStructBadgeDisplayType.BADGEDISPLAYTYPE_COMBINE) {
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

moduleRegistry.register(TiktokInitializer);