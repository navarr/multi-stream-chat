import {ReactEvent} from "../../../event/ReactEvent";
import {ContainsUsername, FromService} from "../../../types/GenericComponents";
import {SERVICE_NAME} from "../constants";

export class LikeEvent extends ReactEvent implements ContainsUsername, FromService {
    sourceService: string = SERVICE_NAME;
    reactionType: string = "like";
    username: string;
}