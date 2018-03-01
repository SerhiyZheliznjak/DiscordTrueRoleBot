import PlayerRecentMatchesJson from "../model/json/PlayerRecentMatchesJson";
import NominationResult from "../model/NominationResult";
import NominationResultJson from "../model/json/NominationResultJson";
import NominationFactory from "../services/NominationFactory";
import Nomination from "../model/Nomination";
import { RecentMatchJson } from "../dota-api/DotaJsonTypings";
import Constants from "../Constants";
import Pair from "../model/Pair";

export default class StorageConvertionUtil {

    public static convertToRecentMatchJson(account_id: number, matches: number[]): PlayerRecentMatchesJson {
        return new PlayerRecentMatchesJson(account_id, matches);
    }

    public static convertToPlayersRecentMatchesMap(recentMatches: PlayerRecentMatchesJson[]): Map<number, number[]> {
        return recentMatches.reduce((map, rmj) => {
            map.set(rmj.account_id, rmj.recentMatchesIds);
            return map;
        }, new Map<number, number[]>());
    }

    public static convertToNominationResultJson(nominationResult: NominationResult): NominationResultJson {
        return new NominationResultJson(
            nominationResult.nomination.getName(),
            nominationResult.account_id,
            nominationResult.nomination.getScore(),
            new Date().getTime()
        );
    }

    public static convertToWonNominations(nominationsWinnersJson: NominationResultJson[]): Map<string, NominationResult> {
        return nominationsWinnersJson.reduce((map, nwj) => {
            const nomination = NominationFactory.createByName(nwj.nominationName);
            nomination.addPoint(Constants.WINNING_MATCH_ID, nwj.score);
            nomination.timeClaimed = nwj.timeClaimed;
            const nw = new NominationResult(nwj.owner_account_id, nomination);
            map.set(nwj.nominationName, nw);
            return map;
        }, new Map<string, NominationResult>());
    }

    public static convertToPlayerObserved(playersPairs: Array<Pair<number, string>>): Map<number, string> {
        return playersPairs.reduce((map, pair) => {
            map.set(pair.p1, pair.p2);
            return map;
        }, new Map<number, string>());
    }
}
