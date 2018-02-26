import { Nomination } from "./Nomination";
import NominationWinner from "./NominationWinner";
import { MatchJson } from "../dota-api/DotaJsonTypings";
import ScoreBoardService from "../services/ScoreBoardService";

export default class ScoreBoard {
    public nominationsWinners: Map<string, NominationWinner>;

    constructor(private scoreBoardService: ScoreBoardService = new ScoreBoardService()) {
        this.nominationsWinners = this.scoreBoardService.initNominationWinners();
    }

    public scorePlayer(account_id: number, fullMatches: MatchJson[]): void {
        this.applyPlayerScores(account_id, this.scoreBoardService.getPlayerScores(account_id, fullMatches));
    }

    private applyPlayerScores(account_id: number, nominations: Nomination[]): void {
        nominations.forEach(challengerNominationResult => {
            const bestResultSoFar = this.nominationsWinners.get(challengerNominationResult.getName());
            if (challengerNominationResult.hasHigherScoreThen(bestResultSoFar.nomination)) {
                bestResultSoFar.account_id = account_id;
                bestResultSoFar.nomination = challengerNominationResult;
            }
        });
    }
}
