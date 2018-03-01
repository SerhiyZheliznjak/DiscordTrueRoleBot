import { MatchJson } from "../dota-api/DotaJsonTypings";
import Nomination from "../model/Nomination";
import Nominations from "../model/Nominations";
import { DotaParser } from "./DotaParser";
import NominationResult from "../model/NominationResult";
import Constants from "../Constants";

export default class ScoreBoardService {
    constructor() { }

    public initNominationResults(): Map<string, NominationResult> {
        return Nominations.all.reduce((map, nomination) => {
            map.set(nomination.getName(), new NominationResult(Constants.UNCLAIMED, nomination));
            return map;
        }, new Map<string, NominationResult>());
    }

    public getPlayerScores(account_id: number, fullMatches: MatchJson[]): Nomination[] {
        return Nominations.all.map(nomination => {
            fullMatches.forEach(match => nomination.scoreMatch(match, DotaParser.getPlayerSlot(match, account_id)));
            return nomination;
        });
    }
}
