import {ChatMessageEvent as BaseChatMessageEvent} from "../../../event/ChatMessageEvent";
import {ContainsUsername} from "../../../types/GenericComponents";
import {Badge, ContainsBadges} from "../../../types/Badges";

class ChatMessageEvent implements BaseChatMessageEvent, ContainsUsername, ContainsBadges {
    badges: Array<Badge>;
    displayName: string;
    messageHtml: string;
    messageText: string;
    sourceService: string = "tiktok";
    username: string;
}