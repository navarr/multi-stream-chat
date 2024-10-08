import {Color} from "./Color";
import {Image} from "./Images";

export interface ContainsDisplayName {
    displayName: string
}

export interface ContainsUsername {
    username: string
}

export interface ContainsMessage {
    messageText: string
    messageHtml: string
}

export interface CouldBeAction {
    isAction: boolean
}

export interface CouldBeAnnouncement {
    isAnnouncement: boolean
}

export interface FromService {
    sourceService: string
}

export interface ContainsUsernameColor {
    userColor: Color
}

export interface ContainsMonthsOfService {
    monthsOfService: number;
}

export interface ContainsAmountSent {
    amountSent: number;
}

export interface ContainsImage {
    image: Image;
}