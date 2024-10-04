import {Color} from "./Color";

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

export interface FromService {
    sourceService: string
}

export interface ContainsUsernameColor {
    userColor: Color
}