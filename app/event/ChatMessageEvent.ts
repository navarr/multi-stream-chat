import {ContainsDisplayName, ContainsMessage, FromService} from "../types/GenericComponents";
import {Event} from "./Event"

const CHAT_MESSAGE_EVENT_NAME = 'comment';

export {CHAT_MESSAGE_EVENT_NAME};

export class ChatMessageEvent implements Event, ContainsMessage, ContainsDisplayName {
    eventType: string = CHAT_MESSAGE_EVENT_NAME;
    displayName: string;
    messageHtml: string;
    messageText: string;
}