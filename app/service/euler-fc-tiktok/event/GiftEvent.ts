import {GiftEvent as BaseGiftEvent} from "../../../event/GiftEvent";
import {ContainsAmountSent, ContainsImage, ContainsUsername} from "../../../types/GenericComponents";
import {Image} from "../../../types/Images";

class GiftImage implements Image {
    imageUrl: string;
    alternativeText: string;

    constructor(imageUrl: string, alternativeText: string) {
        this.imageUrl = imageUrl;
        this.alternativeText = alternativeText;
    }
}

/**
 * Describes a completed gift event.
 *
 * Useful for making things happen after all gifts in a combo have been given (summary style)
 */
class FinalGiftEvent extends BaseGiftEvent implements ContainsUsername, ContainsAmountSent, ContainsImage {
    username: string;
    amountSent: number;
    image: GiftImage;

    constructor(name: string, value: number, displayName: string, username: string, image: GiftImage, amountSent: number = 1) {
        super(name, value, 'diamonds', displayName)
        this.username = username;
        this.image = image;
        this.amountSent = amountSent;
    }
}

const COMBO_GIFT_EVENT_NAME = 'combo_gift';

/**
 * Describes a combo gift event
 *
 * Useful for making things happen as each gift in a combo is given
 */
class ComboGiftEvent extends FinalGiftEvent {
    eventType: string = COMBO_GIFT_EVENT_NAME;
}

export {COMBO_GIFT_EVENT_NAME, GiftImage, ComboGiftEvent, FinalGiftEvent}