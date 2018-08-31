import NominationResult from "./NominationResult";
import { MatchJson } from "../dota-api/DotaJsonTypings";
import ScoreBoardService from "../services/ScoreBoardService";

export default class ScoreBoard {
    private nominationsResults: Map<number, NominationResult[]>;

    constructor(private scoreBoardService: ScoreBoardService = new ScoreBoardService()) {
        this.nominationsResults = this.scoreBoardService.initNominationResults();
    }

    public scorePlayer(account_id: number, fullMatches: MatchJson[]): void {
        this.scoreBoardService.applyPlayerData(account_id, fullMatches, this.nominationsResults);
    }

    public getFirstPlaces(): Map<number, NominationResult> {
        const winners = new Map<number, NominationResult>();
        for (const nominationKey of this.nominationsResults.keys()) {
            const sortedResults = this.nominationsResults.get(nominationKey).sort((a, b) => a.nomination.compare(b.nomination));
            winners.set(nominationKey, sortedResults[0]);
        }
        return winners;
    }

    public getTopN(n: number): Map<number, NominationResult[]> {
        return this.scoreBoardService.getTopN(n, this.nominationsResults);
    }

    public hasScores(nominationKey: number): boolean {
        return this.nominationsResults.get(nominationKey).reduce((scored, nom) => scored || nom.nomination.isScored(), false);
    }
}
