import {ChatMessageEvent as BaseChatMessageEvent} from "../../../event/ChatMessageEvent";
import {ContainsUsername, FromService} from "../../../types/GenericComponents";
import {Badge, ContainsBadges} from "../../../types/Badges";
import {SERVICE_NAME} from "../constants";

export class ChatMessageEvent extends BaseChatMessageEvent implements FromService, ContainsUsername, ContainsBadges {
    sourceService: string = SERVICE_NAME;
    badges: Array<Badge>;
    username: string;
}