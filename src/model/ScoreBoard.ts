import { Nomination } from "./Nomination";
import Nominations from "./Nominations";
import { Constants } from "../Constants";
import PlayerScore from "./PlayerScore";
import NominationWinner from "./NominationWinner";

export default class ScoreBoard {
    public nominationsWinners: Map<string, NominationWinner>;

    constructor() {
        this.nominationsWinners = Nominations.all.reduce((map, nomination) => {
            map.set(nomination.getName(), new NominationWinner(Constants.UNCLAIMED, nomination))
            return map;
        }, new Map<string, NominationWinner>());
    }
    applyPlayerScores(account_id: string, challenger: PlayerScore): void {
        challenger.nominations.forEach(challengerNominationResult => {
            const bestResultSoFar = this.nominationsWinners.get(challengerNominationResult.getName());
            if (challengerNominationResult.hasHigherScoreThen(bestResultSoFar.nomination)) {
                bestResultSoFar.account_id = account_id;
                bestResultSoFar.nomination = challengerNominationResult;
            }
        });
    }
    getNominationsWinners(): Map<string, NominationWinner> {
        return this.nominationsWinners;
    }
}