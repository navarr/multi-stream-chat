import {ChatMessageEvent} from "./ChatMessageEvent";

export interface ChatActionEvent extends ChatMessageEvent {
    isAction: boolean
}