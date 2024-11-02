import {CommentEvent as BaseChatMessageEvent} from "../../../event/CommentEvent";
import {ContainsDisplayName, ContainsUserAvatar, ContainsUsername, FromService} from "../../../types/GenericComponents";
import {Badge, ContainsBadges} from "../../../types/Badges";
import {SERVICE_NAME} from "../constants";
import {SimpleMessage as BaseSimpleMessage} from "../../../types/SimpleMessage";
import {Image} from "../../../types/Images";

export enum ChatMessageFx {
    NONE,
    ACTION, /* a /me message, like traditional IRC */
    INTRO, /* A user's first message in a channel "Introduce Yourself" prompt */
    ANNOUNCEMENT,
    HIGHLIGHT,
    POWER_UP_EFFECT,
    GIGANTIFIED_EMOTE,
}

export interface SimpleMessage extends BaseSimpleMessage, ContainsUsername, ContainsDisplayName {
    messageText: string;
    username: string;
    displayName: string;
}

export class ChatMessageEvent extends BaseChatMessageEvent implements FromService, ContainsUsername, ContainsBadges {
    sourceService: string = SERVICE_NAME;
    badges: Badge[];
    username: string;
    eventType: string;
    messageEffect: ChatMessageFx = ChatMessageFx.NONE;
    parentMessage: SimpleMessage;

    /* TODO
     - Profile Image
     - Who's chat?
     */

    constructor(
        username: string,
        displayName: string,
        messageText: string,
        messageHtml: string,
        badges: Badge[] = [],
        messageEffect: ChatMessageFx = ChatMessageFx.NONE,
        parentMessage?: SimpleMessage,
    ) {
        super(displayName, messageHtml, messageText);
        this.username = username;
        this.badges = badges;
        this.messageEffect = messageEffect;
        this.parentMessage = parentMessage;
    }
}