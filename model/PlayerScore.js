const NominationsList = require('./NominationsList');

class PlayerScore {
    constructor(account_id, recentMatchesIds) {
        this._account_id = account_id;
        this._nominations = NominationsList.create();
        this.recentMatchesIds = !!recentMatchesIds ? recentMatchesIds : [];
    }
    getAccountId() {
        return this._account_id
    };
    getNominations() {
        return this._nominations;
    }
    updateNominations(nominations) {
        this._nominations = nominations;
    }
    getUnnominatedMatches(recentMatchesIds) {
        const unnominatedMatches = recentMatchesIds.filter(rm_id=>!this.recentMatchesIds.find(nrm_id=>rm_id===nrm_id));
        this.hasNewMatches = !!unnominatedMatches.length;
        return unnominatedMatches;
    }
    setPointsFromJsonObject(jsonNominations) {
        this._nominations.forEach(nomination => {
            const jsonN = jsonNominations.find(n=> n._name === nomination.getName());
            if(!!jsonN) {
                nomination.getPoints().push(...jsonN._points);
            }
        });
    }
}

module.exports = PlayerScore;