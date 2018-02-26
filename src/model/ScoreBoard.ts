import { Nomination } from "./Nomination";
import Nominations from "./Nominations";
import { Constants } from "../Constants";
import NominationWinner from "./NominationWinner";
import Pair from "./Pair";

export default class ScoreBoard {
    public nominationsWinners: Map<string, NominationWinner>;

    constructor() {
        this.nominationsWinners = Nominations.all.reduce((map, nomination) => {
            map.set(nomination.getName(), new NominationWinner(Constants.UNCLAIMED, nomination));
            return map;
        }, new Map<string, NominationWinner>());
    }
    applyPlayerScores(challenger: Pair<number, Nomination[]>): void {
        challenger.val.forEach(challengerNominationResult => {
            const bestResultSoFar = this.nominationsWinners.get(challengerNominationResult.getName());
            if (challengerNominationResult.hasHigherScoreThen(bestResultSoFar.nomination)) {
                bestResultSoFar.account_id = challenger.key;
                bestResultSoFar.nomination = challengerNominationResult;
            }
        });
    }
}
