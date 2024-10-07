import {TiktokInitializer} from "./service/euler-fc-tiktok/initializer";
import {eventHandler} from "./framework/EventHandler";
import {CHAT_MESSAGE_EVENT_NAME, ChatMessageEvent} from "./event/ChatMessageEvent";
import {JOIN_EVENT_NAME, JoinEvent} from "./event/JoinEvent";
import {REACT_EVENT_NAME, ReactEvent} from "./event/ReactEvent";

// First, attach listeners
eventHandler.addListener(CHAT_MESSAGE_EVENT_NAME, (event: ChatMessageEvent) => {
    console.log(`<${event.displayName}> ${event.messageText}`);
});

eventHandler.addListener(JOIN_EVENT_NAME, (event: JoinEvent) => {
    console.log(`${event.displayName} joined`);
});

eventHandler.addListener(REACT_EVENT_NAME, (event: ReactEvent) => {
    console.log(`${event.displayName} reacted: ${event.reactionType}`);
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