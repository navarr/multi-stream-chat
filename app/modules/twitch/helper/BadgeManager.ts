import {ApiClient, HelixChatBadgeSet} from "@twurple/api";
import {ImageBadge} from "../../../types/Badges";

class BadgeManager {
    private globalBadgesLoaded: boolean = false;
    private badges: Record<string, Record<string, ImageBadge>> = {};

    private storeBadges(badges: HelixChatBadgeSet[]): void {
        for (let badgeIncrement in badges) {
            let badgeId = badges[badgeIncrement].id;
            if (this.badges[badgeId] === undefined) {
                this.badges[badgeId] = {};
            }
            for(let versionIncrement in badges[badgeIncrement].versions) {
                const badgeVersion = badges[badgeIncrement].versions[versionIncrement];
                const badge = new ImageBadge();
                badge.imageUrl = badgeVersion.getImageUrl(1);
                badge.alternativeText = badgeVersion.title;
                badge.srcset = [
                    {imageUrl: badgeVersion.getImageUrl(2), alternativeText: badgeVersion.title, sizeDescriptor: '2x'},
                    {imageUrl: badgeVersion.getImageUrl(4), alternativeText: badgeVersion.title, sizeDescriptor: '4x'}
                ];
                this.badges[badgeId][badgeVersion.id] = badge;
            }
        }
    }

    public getBadge(badgeId: string, badgeVersionId: string): ImageBadge|null {
        if (this.badges[badgeId] === undefined) { return null; }
        return this.badges[badgeId][badgeVersionId] ?? null;
    }

    public async loadGlobalTwitchBadges(apiClient: ApiClient) {
        const badges = await apiClient.chat.getGlobalBadges();
        this.storeBadges(badges);
        this.globalBadgesLoaded = true;
    }

    public async loadChannelTwitchBadges(apiClient: ApiClient, channelId: string) {
        if (!this.globalBadgesLoaded) await this.loadGlobalTwitchBadges(apiClient);

        const badges = await apiClient.chat.getChannelBadges(channelId);
        this.storeBadges(badges);
    }
}

const badgeManager = new BadgeManager();

export {badgeManager};