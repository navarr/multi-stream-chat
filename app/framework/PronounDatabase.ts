import('node-fetch');

type ServiceUserIdentifier = string;

const userAgent = 'Nyavarr/Multi-Chat-Client v0.2 https://github.com/navarr/multi-chat-client';

export type PronounUser = {
    service: string,
    username: string,
    userId: string
}

class PronounDatabase {
    private pronouns: Record<ServiceUserIdentifier, string> = {};
    private fetchServices: FetchServiceClass[] = [
        new AlejoFetchService(),
        new PronounDbFetchService()
    ];

    public async getPronouns(user: PronounUser): Promise<string> {
        const recordIdentifier = this.getPronounIdentifier(user);
        if (this.pronouns[recordIdentifier]) {
            return this.pronouns[recordIdentifier];
        }

        let result: string|null|undefined;
        for (let serviceIndex in this.fetchServices) {
            const fetchService = this.fetchServices[serviceIndex];
            if (!fetchService.supports(user.service)) {
                continue;
            }

            result = await fetchService.fetch(user);
            if (result) {
                this.pronouns[recordIdentifier] = result;
                return result;
            }
        }

        return undefined;
    }

    private getPronounIdentifier(user: PronounUser): ServiceUserIdentifier {
        return user.service.toLowerCase() + '_' + user.username.toLowerCase();
    }
}

interface FetchServiceClass {
    supports(service: string): boolean;
    fetch(user: PronounUser): Promise<string|null>;
}

class PronounDbFetchService implements FetchServiceClass {
    private primary = {
        "he": "he",
        "it": "it",
        "she": "she",
        "they": "they"
    };
    private secondary = {
        "he": "him",
        "it": "its",
        "she": "her",
        "they": "them"
    };

    public supports(service: string): boolean {
        return ['discord', 'github', 'minecraft', 'twitch', 'twitter'].includes(service);
    }

    public async fetch(user: PronounUser): Promise<string|null> {
        if (!this.supports(user.service)) {
            return null;
        }

        let response = await fetch(`https://pronoundb.org/api/v2/lookup?platform=${user.service}&ids=${user.userId}`, {headers: {'User-Agent': userAgent}});
        if (response.ok) {
            response = await response.json();
        }

        if (!response[user.userId] || !response[user.userId]?.sets?.en) {
            return null;
        }

        const sets: string[] = response['username'].sets.en;
        return `${this.primary[sets[0]]}/${this.secondary[sets.length > 1 ? sets[1] : sets[0]]}`
    }
}

class AlejoFetchService implements FetchServiceClass {
    public supports(service: string): boolean {
        return service === 'twitch';
    }

    public async fetch(user: PronounUser): Promise<string|null> {
        if (!this.supports(user.service)) {
            return null;
        }

        let response = await fetch(`https://api.pronouns.alejo.io/v1/users/${user.username}`, {headers: {'User-Agent': userAgent}});
        if (response.ok) {
            response = await response.json();
            return this.convert(response['pronoun_id'], response['alt_pronoun_id']);
        } else {
            return null;
        }
    }

    private convert(pronounId: string|null, altPronounId: string|null): string {
        if (pronounId === null && altPronounId === null) {
            return 'they/them';
        }
        if (altPronounId !== null) {
            let pronoun = this.convert(pronounId, null);
            let altPronoun = this.convert(altPronounId, null);

            return pronoun.split('/')[0] + '/' + altPronoun.split('/')[0];
        }

        switch (pronounId) {
            case 'hehim':
                return 'he/him';
            case 'hethem':
                return 'he/them';
            case 'sheher':
                return 'she/her';
            case 'shethem':
                return 'she/them';
            case 'aeaer':
                return 'ae/aer';
            case 'eem':
                return 'e/em';
            case 'faefaer':
                return 'fae/faer';
            case 'heshe':
                return 'he/she';
            case 'itits':
                return 'it/its';
            case 'perper':
                return 'per/per';
            case 'vever':
                return 've/ver';
            case 'xexem':
                return 'xe/xem';
            case 'ziehir':
                return 'zie/hir';
            case 'theythem':
            default:
                return 'they/them';
        }
    }
}

const pronounDatabase = new PronounDatabase();

export {pronounDatabase};