import PlayerRecentMatchesJson from "../model/json/PlayerRecentMatchesJson";
import NominationWinner from "../model/NominationWinner";
import NominationWinnerJson from "../model/json/NominationWinnerJson";
import NominationFactory from "../services/NominationFactory";
import { Nomination } from "../model/Nomination";
import { RecentMatchJson } from "../dota-api/DotaJsonTypings";
import { Constants } from "../Constants";
import Pair from "../model/Pair";

export default class StorageConvertionUtil {

    public static convertToRecentMatchJson(recentMatches: Map<number, number[]>): PlayerRecentMatchesJson[] {
        const recentPlayerMatches = [];
        for (const pair of recentMatches.entries()) {
            recentPlayerMatches.push(new PlayerRecentMatchesJson(pair[0], pair[1]));
        }
        return recentPlayerMatches;
    }

    public static convertToPlayerRecentMatches(recentMatches: PlayerRecentMatchesJson[]): Map<number, number[]> {
        return recentMatches.reduce((map, rmj) => {
            map.set(rmj.account_id, rmj.recentMatchesIds);
            return map;
        }, new Map<number, number[]>());
    }

    public static convertToNominationWinnersJson(nominationsWinners: Map<string, NominationWinner>): NominationWinnerJson[] {
        const nominationWinnersJson = [];
        for (const nw of nominationsWinners.values()) {
            nominationWinnersJson.push(new NominationWinnerJson(nw.nomination.getName(), nw.account_id, nw.nomination.getScore()));
        }
        return nominationWinnersJson;
    }

    public static convertToWonNominations(nominationsWinnersJson: NominationWinnerJson[]): Map<string, NominationWinner> {
        return nominationsWinnersJson.reduce((map, nwj) => {
            const nomination = NominationFactory.createByName(nwj.nominationName);
            nomination.addPoint(Constants.WINNING_MATCH_ID, nwj.score);
            const nw = new NominationWinner(nwj.owner_account_id, nomination);
            map.set(nwj.nominationName, nw);
            return map;
        }, new Map<string, NominationWinner>());
    }

    public static convertToPlayersPairs(playerObserved: Map<number, string>): Array<Pair<number, string>> {
        const pairs = [];
        for (const account_id of playerObserved.keys()) {
            pairs.push(new Pair(account_id, playerObserved.get(account_id)));
        }
        return pairs;
    }

    public static convertToPlayerObserved(playersPairs: Array<Pair<number, string>>): Map<number, string> {
        return playersPairs.reduce((map, pair) => {
            map.set(pair.key, pair.val);
            return map;
        }, new Map<number, string>());
    }
}
