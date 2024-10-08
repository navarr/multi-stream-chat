import {ContainsDisplayName} from "../types/GenericComponents";
import {Event} from "./Event"

const SUBSCRIBE_EVENT_NAME = 'subscribe';

class SubscribeEvent implements Event, ContainsDisplayName {
    displayName: string;
    eventType: string = SUBSCRIBE_EVENT_NAME;

    constructor(displayName: string) {
        this.displayName = displayName;
    }
}

export {SUBSCRIBE_EVENT_NAME, SubscribeEvent}