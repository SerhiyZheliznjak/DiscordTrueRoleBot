import { MatchJson } from "../dota-api/DotaJsonTypings";
import Nomination from "../model/Nomination";
import Nominations from "../model/Nominations";
import { DotaParser } from "./DotaParser";
import NominationResult from "../model/NominationResult";
import Constants from "../Constants";

export default class ScoreBoardService {
    constructor() { }

    public initNominationResults(): Map<number, NominationResult> {
        return Nominations.all.reduce((map, nomination) => {
            map.set(nomination.getKey(), new NominationResult(Constants.UNCLAIMED, nomination));
            return map;
        }, new Map<number, NominationResult>());
    }

    public getPlayerScores(account_id: number, fullMatches: MatchJson[]): Nomination[] {
        return Nominations.all.map(nomination => {
            fullMatches.forEach(match => nomination.scoreMatch(match, DotaParser.getPlayerSlot(match, account_id)));
            return nomination;
        });
    }
}
