import {ChatMessageEvent as BaseChatMessageEvent} from "../../../event/ChatMessageEvent";
import {ContainsUsername, CouldBeAction, CouldBeAnnouncement} from "../../../types/GenericComponents";
import {Badge, ContainsBadges} from "../../../types/Badges";

class ChatMessageEvent implements BaseChatMessageEvent, ContainsUsername, ContainsBadges, CouldBeAction, CouldBeAnnouncement {
    isAnnouncement: boolean;
    isAction: boolean;
    badges: Badge[];
    username: string;
    eventType: string;
    displayName: string;
    messageHtml: string;
    messageText: string;
}