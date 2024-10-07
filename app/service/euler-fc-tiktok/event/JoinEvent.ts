import {JoinEvent as BaseJoinEvent} from "../../../event/JoinEvent";
import {ContainsUsername, FromService} from "../../../types/GenericComponents";
import {SERVICE_NAME} from "../constants";

export class JoinEvent extends BaseJoinEvent implements ContainsUsername, FromService {
    sourceService: string = SERVICE_NAME;
    username: string;
}