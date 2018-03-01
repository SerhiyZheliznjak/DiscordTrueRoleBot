import PlayerRecentMatchesJson from "../model/json/PlayerRecentMatchesJson";
import NominationWinner from "../model/NominationWinner";
import NominationWinnerJson from "../model/json/NominationWinnerJson";
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

    public static convertToNominationWinnersJson(nominationsWinners: Map<string, NominationWinner>): NominationWinnerJson[] {
        const nominationWinnersJson = [];
        for (const nw of nominationsWinners.values()) {
            nominationWinnersJson.push(new NominationWinnerJson(
                nw.nomination.getName(),
                nw.account_id,
                nw.nomination.getScore(),
                new Date().getTime()
            ));
        }
        return nominationWinnersJson;
    }

    public static convertToWonNominations(nominationsWinnersJson: NominationWinnerJson[]): Map<string, NominationWinner> {
        return nominationsWinnersJson.reduce((map, nwj) => {
            const nomination = NominationFactory.createByName(nwj.nominationName);
            nomination.addPoint(Constants.WINNING_MATCH_ID, nwj.score);
            nomination.timeClaimed = nwj.timeClaimed;
            const nw = new NominationWinner(nwj.owner_account_id, nomination);
            map.set(nwj.nominationName, nw);
            return map;
        }, new Map<string, NominationWinner>());
    }

    public static convertToPair<K, V>(key: K, val: V): Pair<K, V> {
        return new Pair(key, val);
    }

    public static convertToPlayerObserved(playersPairs: Array<Pair<number, string>>): Map<number, string> {
        return playersPairs.reduce((map, pair) => {
            map.set(pair.key, pair.val);
            return map;
        }, new Map<number, string>());
    }
}
