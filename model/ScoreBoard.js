const NominationsList = require('./NominationsList');
const CONST = require('../constants');

class ScoreBoard {
    constructor() {
        this._nominationList = NominationsList.create();
        this.results = this._nominationList.reduce((res, nomination) => {
            res[nomination.getName()] = {
                account_id: CONST.UNCLAIMED(),
                nomination: nomination
            };
            return res;
        }, {});
    }
    applyPlayerScores(challenger) {
        challenger.getNominations().forEach(cn => {
            const bestResult = this.results[cn.getName()];
            if (cn.hasHigherScoreThen(bestResult.nomination)) {
                bestResult.account_id = challenger.getAccountId();
                bestResult.nomination = cn;
            }
        });
    }
    getNominationsWinners() {
        return this._nominationList.map(nomination => this.results[nomination.getName()])
            .filter(winner => winner.nomination.isScored());
    }
    getUnclaimedNominations() {
        return this._nominationList.map(nomination => this.results[nomination.getName()])
            .filter(winner => !winner.nomination.isScored());
    }
}

module.exports = ScoreBoard;