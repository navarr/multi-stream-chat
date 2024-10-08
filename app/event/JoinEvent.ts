import {ContainsDisplayName} from "../types/GenericComponents";
import {Event} from "./Event"

const JOIN_EVENT_NAME = 'join';

export {JOIN_EVENT_NAME};

export class JoinEvent implements Event, ContainsDisplayName {
    eventType: string = JOIN_EVENT_NAME;
    displayName: string;

    constructor(displayName: string) {
        this.displayName = displayName;
    }
}