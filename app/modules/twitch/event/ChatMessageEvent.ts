import {CommentEvent as BaseChatMessageEvent} from "../../../event/CommentEvent";
import {ContainsUsername, CouldBeAction, CouldBeAnnouncement} from "../../../types/GenericComponents";
import {Badge, ContainsBadges} from "../../../types/Badges";

export class ChatMessageEvent extends BaseChatMessageEvent implements ContainsUsername, ContainsBadges, CouldBeAction, CouldBeAnnouncement {
    isAnnouncement: boolean;
    isAction: boolean;
    badges: Badge[];
    username: string;
    eventType: string;

    /* TODO
     - Highlights (power up fx, channel points highlight)
     - Is User Intro?
     - Profile Image
     - Who's chat?
     - Gigantified Emotes
     - Parent Message
     */

    constructor(username: string, displayName: string, messageText: string, messageHtml: string, isAction: boolean = false, badges: Badge[] = [], isAnnouncement: boolean = false) {
        super(displayName, messageHtml, messageText);
        this.username = username;
        this.isAction = isAction;
        this.isAnnouncement = isAnnouncement;
        this.badges = badges;
    }
}