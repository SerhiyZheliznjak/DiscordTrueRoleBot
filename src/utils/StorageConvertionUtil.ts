import PlayerScoreJson from "../model/json/PlayerScoreJson";
import PlayerScore from "../model/PlayerScore";
import { NominationJson } from "../model/json/NominationJson";
import NominationWinner from "../model/NominationWinner";
import NominationWinnerJson from "../model/json/NominationWinnerJson";
import NominationFactory from "../services/NominationFactory";

export default class StorageConvertionUtil {
    public static convertToPlayersScores(playersScoreJson: PlayerScoreJson[]): Map<string, PlayerScore> {
        return playersScoreJson.reduce((map, playerScoreJson) => {
            const ps = new PlayerScore(playerScoreJson.recentMatchesIds);
            ps.setPointsFromJsonObject(playerScoreJson.nominations);
            map.set(playerScoreJson.account_id, ps);
            return map;
        }, new Map<string, PlayerScore>());
    }

    public static convertToPlayersScoreJson(playersScore: Map<string, PlayerScore>): PlayerScoreJson[] { 
        const playersScoreJson: PlayerScoreJson[] = [];
        for(let pair of playersScore.entries()) {
            const psj = new PlayerScoreJson();
            psj.account_id = pair[0];
            psj.recentMatchesIds = pair[1].recentMatchesIds;
            psj.nominations = pair[1].nominations.map(nomination => {
                return new NominationJson(nomination.getName(), nomination.getPoints());
            });
            playersScoreJson.push(psj);
        }
        return playersScoreJson;
    }

    public static convertToNominationWinnersJson(nominationsWinners: Map<string, NominationWinner>): NominationWinnerJson[] {
        const nominationWinnersJson = [];
        for(let nw of nominationsWinners.values()) {
            const nJson = new NominationJson(nw.nomination.getName(), nw.nomination.getPoints());
            const nwj = new NominationWinnerJson(nw.account_id, nJson);
            nominationWinnersJson.push(nwj);
        }
        return nominationWinnersJson;
    }

    public static convertToWonNominations(nominationsWinnersJson: NominationWinnerJson[]): Map<string, NominationWinner> {
        return nominationsWinnersJson.reduce((map, nwj)=> {
            const nomination = NominationFactory.createByName(nwj.nomination.name);
            nwj.nomination.points.forEach(nwjPoint => nomination.addPoint(nwjPoint.match_id, nwjPoint.point));
            const nw = new NominationWinner(nwj.account_id, nomination);
            map.set(nwj.nomination.name, nw);
            return map;
        }, new Map<string, NominationWinner>());
    }
}
