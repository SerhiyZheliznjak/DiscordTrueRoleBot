import { MatchJson } from "../dota-api/DotaJsonTypings";
import { Nomination } from "../model/Nomination";
import Nominations from "../model/Nominations";
import { DotaParser } from "./DotaParser";
import NominationWinner from "../model/NominationWinner";
import { Constants } from "../Constants";

export default class ScoreBoardService {
    constructor() { }

    public initNominationWinners(): Map<string, NominationWinner> {
        return Nominations.all.reduce((map, nomination) => {
            map.set(nomination.getName(), new NominationWinner(Constants.UNCLAIMED, nomination));
            return map;
        }, new Map<string, NominationWinner>());
    }

    public getPlayerScores(account_id: number, fullMatches: MatchJson[]): Nomination[] {
        return Nominations.all.map(nomination => {
            fullMatches.forEach(match => nomination.scoreMatch(match, DotaParser.getPlayerSlot(match, account_id)));
            return nomination;
        });
    }
}
