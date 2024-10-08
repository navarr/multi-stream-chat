import {ReactEvent} from "../../../event/ReactEvent";
import {ContainsAmountSent, ContainsUsername, FromService} from "../../../types/GenericComponents";
import {SERVICE_NAME} from "../constants";

export class LikeEvent extends ReactEvent implements ContainsUsername, FromService, ContainsAmountSent {
    sourceService: string = SERVICE_NAME;
    reactionType: string = "like";
    username: string;
    amountSent: number;

    constructor(displayName: string, username: string, amountSent: number = 1) {
        super(displayName, 'like');
        this.username = username;
        this.amountSent = amountSent;
    }
}