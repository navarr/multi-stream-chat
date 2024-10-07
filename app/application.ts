import {TiktokInitializer} from "./service/euler-fc-tiktok/initializer";
import {eventHandler} from "./framework/EventHandler";
import {CHAT_MESSAGE_EVENT_NAME, ChatMessageEvent} from "./event/ChatMessageEvent";
import {JOIN_EVENT_NAME, JoinEvent} from "./event/JoinEvent";

eventHandler.addListener(CHAT_MESSAGE_EVENT_NAME, (event: ChatMessageEvent) => {
    console.log(`<${event.displayName}> ${event.messageText}`);
});

eventHandler.addListener(JOIN_EVENT_NAME, (event: JoinEvent) => {
    console.log(`${event.displayName} joined`);
})

const tiktokModule = new TiktokInitializer();
tiktokModule.initialize();

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