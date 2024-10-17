import {Color} from "./Color";
import {Image} from "./Images";

export interface ContainsDisplayName {
    displayName: string
}
export function containsDisplayName(obj: any): obj is ContainsDisplayName {
    return obj.hasOwnProperty('displayName');
}

export interface ContainsUsername {
    username: string
}
export function containsUsername(obj: any): obj is ContainsUsername {
    return obj.hasOwnProperty('username');
}

export interface ContainsMessage {
    messageText: string
    messageHtml: string
}
export function containsMessage(obj: any): obj is ContainsMessage {
    return obj.hasOwnProperty('messageText') && obj.hasOwnProperty('messageHtml');
}

export interface CouldBeAction {
    isAction: boolean
}
export function isAction(obj: any): obj is CouldBeAction {
    return obj.hasOwnProperty('isAction') && obj.isAction;
}

export interface CouldBeAnnouncement {
    isAnnouncement: boolean
}
export function isAnnouncement(obj: any): obj is CouldBeAnnouncement {
    return obj.hasOwnProperty('isAnnouncement') && obj.isAnnouncement;
}

export interface FromService {
    sourceService: string
}
export function containsSourceService(obj: any): obj is FromService {
    return obj.hasOwnProperty('sourceService');
}

export interface ContainsUsernameColor {
    userColor: Color
}
export function containsUsernameColor(obj: any): obj is ContainsUsernameColor {
    return obj.hasOwnProperty('userColor');
}

export interface ContainsMonthsOfService {
    monthsOfService: number;
}
export function containsMonthsOfService(obj: any): obj is ContainsMonthsOfService {
    return obj.hasOwnProperty('monthsOfService');
}

export interface ContainsAmountSent {
    amountSent: number;
}
export function containsAmountSent(obj: any): obj is ContainsAmountSent {
    return obj.hasOwnProperty('amountSent');
}

export interface ContainsImage {
    image: Image;
}
export function containsImage(obj: any): obj is ContainsImage {
    return obj.hasOwnProperty('image');
}