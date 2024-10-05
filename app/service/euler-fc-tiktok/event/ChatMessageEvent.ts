import {ChatMessageEvent as BaseChatMessageEvent} from "../../../event/ChatMessageEvent";
import {ContainsUsername, FromService} from "../../../types/GenericComponents";
import {Badge, ContainsBadges} from "../../../types/Badges";

export class ChatMessageEvent extends BaseChatMessageEvent implements FromService, ContainsUsername, ContainsBadges {
    sourceService: string = "tiktok";
    badges: Array<Badge>;
    username: string;
}