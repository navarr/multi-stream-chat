import {ContainsDisplayName} from "../types/GenericComponents";
import {Event} from "./Event"

const SHARE_EVENT_NAME = 'share';

class ShareEvent implements Event, ContainsDisplayName {
    eventType: string = SHARE_EVENT_NAME;
    displayName: string;

    constructor(displayName: string) {
        this.displayName = displayName;
    }
}

export {SHARE_EVENT_NAME, ShareEvent}