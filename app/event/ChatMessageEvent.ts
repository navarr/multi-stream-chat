import {ContainsDisplayName, ContainsMessage, FromService} from "../types/GenericComponents";

export interface ChatMessageEvent extends FromService, ContainsMessage, ContainsDisplayName {

}