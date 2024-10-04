import {ChatMessageEvent as BaseChatMessageEvent} from "../../../event/ChatMessageEvent";
import {ContainsUsername, CouldBeAction, CouldBeAnnouncement} from "../../../types/GenericComponents";
import {Badge, ContainsBadges} from "../../../types/Badges";

class ChatMessageEvent implements BaseChatMessageEvent, ContainsUsername, ContainsBadges, CouldBeAction, CouldBeAnnouncement {
    badges: Array<Badge>;
    displayName: string;
    isAction: boolean = false;
    isAnnouncement: boolean = false;
    messageHtml: string = '';
    messageText: string = '';
    sourceService: string = "twitch";
    username: string;
}