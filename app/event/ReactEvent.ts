import {ContainsDisplayName} from "../types/GenericComponents";
import {Event} from "./Event"

const REACT_EVENT_NAME = 'reaction';

class ReactEvent implements Event, ContainsDisplayName {
    eventType: string = REACT_EVENT_NAME;
    displayName: string;
    reactionType: string;

    constructor(displayName: string, reactionType: string) {
        this.displayName = displayName;
        this.reactionType = reactionType;
    }
}

export {REACT_EVENT_NAME, ReactEvent}