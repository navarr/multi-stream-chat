import {ContainsDisplayName, ContainsMessage} from "../types/GenericComponents";
import {Event} from "./Event"

const CHAT_MESSAGE_EVENT_NAME = 'comment';

class CommentEvent implements Event, ContainsMessage, ContainsDisplayName {
    eventType: string = CHAT_MESSAGE_EVENT_NAME;
    displayName: string;
    messageHtml: string;
    messageText: string;

    constructor(displayName: string, messageHtml: string, messageText: string) {
        this.displayName = displayName;
        this.messageHtml = messageHtml;
        this.messageText = messageText;
    }
}

export {CHAT_MESSAGE_EVENT_NAME, CommentEvent};