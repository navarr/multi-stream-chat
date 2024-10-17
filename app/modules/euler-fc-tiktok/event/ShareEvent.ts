import {ShareEvent as BaseShareEvent} from "../../../event/ShareEvent";
import {ContainsAmountSent, ContainsUsername, FromService} from "../../../types/GenericComponents";
import {SERVICE_NAME} from "../constants";

export class ShareEvent extends BaseShareEvent implements ContainsUsername, FromService, ContainsAmountSent {
    sourceService: string = SERVICE_NAME;
    username: string;
    amountSent: number;

    constructor(displayName: string, username: string, amountSent: number = 1) {
        super(displayName);
        this.username = username;
        this.amountSent = amountSent;
    }
}