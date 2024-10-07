import {ReactEvent} from "../../../event/ReactEvent";
import {ContainsUsername} from "../../../types/GenericComponents";

export class LikeEvent extends ReactEvent implements ContainsUsername {
    reactionType: string = "like";
    username: string;
}