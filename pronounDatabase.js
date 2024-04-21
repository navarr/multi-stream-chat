import('node-fetch');

class PronounDatabase {
    constructor() {
        this.pronouns = {};
    }

    /**
     * @param {string} service
     * @param {string} username
     * @return {Promise}
     */
    getPronouns(service, username) {
        const db = this;
        return new Promise((resolve, reject) => {
            if (service !== 'twitch') {
                reject("Unsupported service");
            }
            let identifier = this.getPronounIdentifier(service, username);
            if (typeof this.pronouns[identifier] !== 'undefined') {
                resolve(this.pronouns[identifier]);
            }
            // Otherwise, query Alejo
            fetch('https://api.pronouns.alejo.io/v1/users/' + username)
                .then(async (response) => {
                    if (response.ok) {
                        response = await response.json();
                        let pronouns = db.alejoPronounConverter(response['pronoun_id'], response['alt_pronoun_id']);
                        db.pronouns[identifier] = pronouns;
                        resolve(pronouns);
                    } else {
                        reject();
                    }
                })
                .catch((error) => reject(error));
        });
    }

    /**
     *
     * @param {string|null} pronounId
     * @param {string|null} altPronounId
     * @return {string}
     */
    alejoPronounConverter(pronounId, altPronounId) {
        if (pronounId === null && altPronounId === null) {
            return 'they/them';
        }
        if (altPronounId !== null) {
            let pronoun = this.alejoPronounConverter(pronounId, null);
            let altPronoun = this.alejoPronounConverter(altPronounId, null);

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

    /**
     * @param {string} service
     * @param {string} username
     * @returns {string}
     */
    getPronounIdentifier(service, username) {
        return service.toLowerCase() + '_' + username.toLowerCase();
    }
}

module.exports = {
    PronounDatabase
};