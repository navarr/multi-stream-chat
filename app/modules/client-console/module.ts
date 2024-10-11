import {eventHandler} from "../../framework/EventHandler";
import {CHAT_MESSAGE_EVENT_NAME, CommentEvent} from "../../event/CommentEvent";
import {JOIN_EVENT_NAME, JoinEvent} from "../../event/JoinEvent";
import {REACT_EVENT_NAME, ReactEvent} from "../../event/ReactEvent";
import {COMBO_GIFT_EVENT_NAME, ComboGiftEvent, GiftSummaryEvent} from "../../modules/euler-fc-tiktok/event/GiftEvent";
import {GIFT_EVENT_NAME} from "../../event/GiftEvent";
import {Module} from "../../framework/Module";
import {moduleRegistry} from "../../framework/ModuleRegistry";

export class ConsoleClient implements Module {
    public static MODULE_NAME: string = 'client-console';
    public static getModuleName(): string {
        return this.MODULE_NAME;
    }

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

moduleRegistry.register(ConsoleClient);