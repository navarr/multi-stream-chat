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

export class ImageBadge implements Badge, Image {
    type: BadgeType = BadgeType.IMAGE;
    srcset: Array<Image & ContainsSizeDescriptor> = []
    alternativeText: string = '';
    imageUrl: string;
}

export class ImageAndTextBadge extends ImageBadge {
    type: BadgeType = BadgeType.IMAGE_AND_TEXT
    displayText: string
    background: Color | null
}