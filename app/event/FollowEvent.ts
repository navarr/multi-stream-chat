import {Event} from './Event'
import {ContainsDisplayName} from "../types/GenericComponents";

const FOLLOW_EVENT_NAME = 'follow';

class FollowEvent implements Event, ContainsDisplayName {
    eventType: string = FOLLOW_EVENT_NAME;
    displayName: string;
}

export {FOLLOW_EVENT_NAME, FollowEvent}