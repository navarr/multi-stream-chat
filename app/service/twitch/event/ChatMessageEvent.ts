import {ChatMessageEvent as BaseChatMessageEvent} from "../../../event/ChatMessageEvent";
import {ContainsUsername} from "../../../types/GenericComponents";
import {ContainsBadges} from "../../../types/Badges";

interface ChatMessageEvent extends BaseChatMessageEvent, ContainsUsername, ContainsBadges {

}