import {ContainsSizeDescriptor, Image} from "./Images";
import {Color} from "./Color";

export interface ContainsBadges {
    badges: Array<Badge>
}

export enum BadgeType {
    IMAGE,
    IMAGE_AND_TEXT
}

export interface Badge {
    type: BadgeType
}

export interface ImageBadge extends Badge, Image {
    srcset: Array<Image & ContainsSizeDescriptor>
}

export interface ImageAndTextBadge extends ImageBadge {
    displayText: string
    background: Color | null
}