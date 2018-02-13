class PlayerScore {
    constructor(account_id, recentMatches, playerScore) {
        this._account_id = account_id;
        this.recentMatches = !!recentMatches ? recentMatches : [];
        this.playerScore = !!playerScore ? playerScore : [];
        this._nominations = [];
    }
    getAccountId() {
        return this._account_id
    };
    getNominations() {
        return this._nominations;
    }
    setNominations(nominations) {
        this._nominations = nominations;
    }
    addNominationScore(nomination) {
        const existing = this._nominations.find(n => n.name === nomination.getName());
        if(!!existing) {
            existing.points = nomination.getPoints();
        } else {
            this._nominations.push({name: nomination.getName(), points: nomination.getPoints()});
        }
    }
    toJSON() {
        return JSON.stringify({
            account_id: this._account_id,
            nominations: this.nominations
        })
    }
}

module.exports = PlayerScore;