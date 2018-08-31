import { MatchJson } from "../dota-api/DotaJsonTypings";
import Nomination from "../model/Nomination";
import Nominations from "../model/Nominations";
import { DotaParser } from "./DotaParser";
import NominationResult from "../model/NominationResult";

export default class ScoreBoardService {
    constructor() { }

    public initNominationResults(): Map<number, NominationResult[]> {
        return Nominations.all.reduce((map, nomination) => {
            map.set(nomination.getKey(), []);
            return map;
        }, new Map<number, NominationResult[]>());
    }

    public applyPlayerData(account_id: number, fullMatches: MatchJson[], nominationsResults: Map<number, NominationResult[]>): void {
        this.getPlayerScores(account_id, fullMatches).forEach((nomination: Nomination) => {
            nominationsResults.get(nomination.getKey()).push(new NominationResult(account_id, nomination));
        });
    }

    public getTopN(n: number, nominationsResults: Map<number, NominationResult[]>): Map<number, NominationResult[]> {
        const topN = new Map<number, NominationResult[]>();
        for (const key of nominationsResults.keys()) {
            const sorted = nominationsResults.get(key).sort((a, b) => a.nomination.compare(b.nomination));
            topN.set(key, sorted.slice(0, n));
        }
        return topN;
    }

    private getPlayerScores(account_id: number, fullMatches: MatchJson[]): Nomination[] {
        return Nominations.all.map(nomination => {
            fullMatches.forEach(match => nomination.scoreMatch(match, DotaParser.getPlayerSlot(match, account_id)));
            return nomination;
        });
    }
}
