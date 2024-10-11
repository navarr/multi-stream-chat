import {eventHandler} from "../framework/EventHandler";
import {CHAT_MESSAGE_EVENT_NAME, CommentEvent} from "../event/CommentEvent";
import {JOIN_EVENT_NAME, JoinEvent} from "../event/JoinEvent";
import {REACT_EVENT_NAME, ReactEvent} from "../event/ReactEvent";
import {COMBO_GIFT_EVENT_NAME, ComboGiftEvent, GiftSummaryEvent} from "../service/euler-fc-tiktok/event/GiftEvent";
import {GIFT_EVENT_NAME} from "../event/GiftEvent";
import {Module} from "../framework/Module";

export class ConsoleClient implements Module {
    moduleName: string = 'client_console';

    initialize(): void {
        eventHandler.addListener(CHAT_MESSAGE_EVENT_NAME, (event: CommentEvent) => {
            console.log(`<${event.displayName}> ${event.messageText}`);
        });

        eventHandler.addListener(JOIN_EVENT_NAME, (event: JoinEvent) => {
            console.log(`${event.displayName} joined`);
        });

        eventHandler.addListener(REACT_EVENT_NAME, (event: ReactEvent) => {
            console.log(`${event.displayName} reacted: ${event.reactionType}`);
        })

        eventHandler.addListener(COMBO_GIFT_EVENT_NAME, (event: ComboGiftEvent) => {
            console.log(`${event.displayName} COMBO ${event.name} x${event.amountSent} (+${event.sentThisEvent})`)
        });

        eventHandler.addListener(GIFT_EVENT_NAME, (event: GiftSummaryEvent) => {
            console.log(`${event.displayName} sent ${event.amountSent} ${event.name}. (${event.value})`)
        })
    }
    shutdown(): void {
        /* No-op */
    }
}
