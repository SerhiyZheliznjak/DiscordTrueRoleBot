const NominationsList = require('./NominationsList');

class ScoreBoard {
    constructor() {
        this._nominationList = NominationsList.create();
        this.results = this._nominationList.reduce((res, nomination) => {
            res[nomination.getName()] = {
                account_id: 'unclaimed',
                nomination: nomination
            };
            return res;
        }, {});
    }
    applyPlayerScores(challenger) {
        challenger.getNominations().forEach(cn => {
            const bestResult = this.results[cn.getName()];
            if (cn.getScore() > bestResult.nomination.getScore()) {
                bestResult.account_id = challenger.getAccountId();
                bestResult.nomination = cn;
            }
        });
    }
    getNominationsWinners() {
        return this._nominationList.map(nomination => this.results[nomination.getName()])
        .filter(winner => winner.nomination.getScore() > 0);
    }
}

module.exports = ScoreBoard;