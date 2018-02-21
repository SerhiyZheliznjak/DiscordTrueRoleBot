import { Nomination } from "./Nomination";
import Nominations from "./Nominations";
import NominationWinner from "./NominationWinner";
import { Constants } from "../Constants";
import PlayerScore from "./PlayerScore";

export default class ScoreBoard {
    private nominationList: Nomination[];
    public results: Map<string, NominationWinner>;

    constructor() {
        this.nominationList = Nominations.all;
        this.results = new Map();
        this.nominationList.forEach(nomination => {
            this.results.set(nomination.getName(), new NominationWinner(Constants.UNCLAIMED, nomination))
        });
    }
    applyPlayerScores(challenger: PlayerScore): void {
        challenger.nominations.forEach(challengedNomination => {
            const bestResultSoFar = this.results.get(challengedNomination.getName());
            if (challengedNomination.hasHigherScoreThen(bestResultSoFar.nomination)) {
                bestResultSoFar.account_id = challenger.account_id;
                bestResultSoFar.nomination = challengedNomination;
            }
        });
    }
    getNominationsWinners(): NominationWinner[] {
        return this.nominationList.map(nomination => this.results.get(nomination.getName()))
            .filter(winner => winner.nomination.isScored());
    }
    getUnclaimedNominations(): NominationWinner[] {
        return this.nominationList.map(nomination => this.results.get(nomination.getName()))
            .filter(winner => !winner.nomination.isScored());
    }
}