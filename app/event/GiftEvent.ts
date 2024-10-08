import {Event} from "./Event"
import {ContainsDisplayName} from "../types/GenericComponents";

const GIFT_EVENT_NAME = 'gift';

class GiftEvent implements Event, ContainsDisplayName {
    eventType: string = GIFT_EVENT_NAME;
    displayName: string;

    name: string;
    value: number;
    currency: string;

    constructor(name: string, value: number, currency: string, displayName: string, ) {
        this.name = name;
        this.value = value;
        this.currency = currency;
        this.displayName = displayName;
    }
}

export {GIFT_EVENT_NAME, GiftEvent}