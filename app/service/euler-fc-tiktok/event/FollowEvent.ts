import {FollowEvent as BaseFollowEvent} from "../../../event/FollowEvent";
import {ContainsUsername, FromService} from "../../../types/GenericComponents";
import {SERVICE_NAME} from "../constants";

export class FollowEvent extends BaseFollowEvent implements ContainsUsername, FromService {
    sourceService: string = SERVICE_NAME;
    username: string;
}