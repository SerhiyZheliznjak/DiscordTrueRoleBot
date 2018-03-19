import Nomination from "./Nomination";
import NominationResult from "./NominationResult";
import { MatchJson } from "../dota-api/DotaJsonTypings";
import ScoreBoardService from "../services/ScoreBoardService";

export default class ScoreBoard {
    public nominationsResults: Map<number, NominationResult>;

    constructor(private scoreBoardService: ScoreBoardService = new ScoreBoardService()) {
        this.nominationsResults = this.scoreBoardService.initNominationResults();
    }

    public scorePlayer(account_id: number, fullMatches: MatchJson[]): void {
        this.applyPlayerScores(account_id, this.scoreBoardService.getPlayerScores(account_id, fullMatches));
    }

    private applyPlayerScores(account_id: number, nominations: Nomination[]): void {
        nominations.forEach(challengerNominationResult => {
            const bestResultSoFar = this.nominationsResults.get(challengerNominationResult.getKey());
            if (challengerNominationResult.hasHigherScoreThen(bestResultSoFar.nomination)) {
                bestResultSoFar.account_id = account_id;
                bestResultSoFar.nomination = challengerNominationResult;
            }
        });
    }
}
