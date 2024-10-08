import {SubscribeEvent as BaseSubscribeEvent} from "../../../event/SubscribeEvent"
import {ContainsMonthsOfService, ContainsUsername, FromService} from "../../../types/GenericComponents";
import {SERVICE_NAME} from "../constants";

export class SubscribeEvent extends BaseSubscribeEvent implements FromService, ContainsUsername, ContainsMonthsOfService {
    sourceService: string = SERVICE_NAME;
    username: string;
    monthsOfService: number;

    constructor(displayName: string, username: string, monthsOfService: number = 1) {
        super(displayName);
        this.username = username;
        this.monthsOfService = monthsOfService;
    }
}