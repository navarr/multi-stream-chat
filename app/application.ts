import {TiktokInitializer} from "./service/euler-fc-tiktok/initializer";
import {eventHandler} from "./framework/EventHandler";
import {CHAT_MESSAGE_EVENT_NAME, CommentEvent} from "./event/CommentEvent";
import {JOIN_EVENT_NAME, JoinEvent} from "./event/JoinEvent";
import {REACT_EVENT_NAME, ReactEvent} from "./event/ReactEvent";
import {COMBO_GIFT_EVENT_NAME, ComboGiftEvent, GiftSummaryEvent} from "./service/euler-fc-tiktok/event/GiftEvent";
import {GIFT_EVENT_NAME} from "./event/GiftEvent";

// First, attach listeners
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

// Then, start everything
const tiktokModule = new TiktokInitializer();
tiktokModule.initialize();

// Finally, register shutdown scripts
let shuttingDown = false;
function shutdown() {
    if (!shuttingDown) {
        shuttingDown = true;
        tiktokModule.shutdown();
    }
}

process.on('SIGINT', shutdown);
process.on('SIGQUIT', shutdown);
process.on('SIGTERM', shutdown);