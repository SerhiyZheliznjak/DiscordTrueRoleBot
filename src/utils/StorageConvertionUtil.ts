import PlayerRecentMatchesJson from "../model/json/PlayerRecentMatchesJson";
import NominationResult from "../model/NominationResult";
import NominationResultJson from "../model/json/NominationResultJson";
import RegisteredPlayerJson from "../model/json/RegisteredPlayerJson";
import PlayerRecentMatches from "../model/PlayerRecentMatches";

export default class StorageConvertionUtil {

    public static convertToRecentMatchJson(account_id: number, matches: number[]): PlayerRecentMatchesJson {
        return new PlayerRecentMatchesJson(account_id, matches);
    }

    public static convertToPlayersRecentMatches(recentMatches: PlayerRecentMatchesJson): PlayerRecentMatches {
        if (recentMatches) {
            return new PlayerRecentMatches(recentMatches.account_id, recentMatches.recentMatchesIds);
        }
        return new PlayerRecentMatches(0, []);
    }

    public static convertToNominationResultJson(nominationResult: NominationResult): NominationResultJson {
        return new NominationResultJson(
            nominationResult.nomination.getKey(),
            nominationResult.nomination.getName(),
            nominationResult.account_id,
            nominationResult.nomination.getScore(),
            nominationResult.nomination.timeClaimed
        );
    }

    public static convertToWonNominations(hallOfFame: NominationResultJson[]): Map<number, NominationResultJson> {
        return hallOfFame.reduce((map, nwj) => {
            if (this.isValidNominationResult(nwj)) {
                map.set(nwj.key, nwj);
            } else {
                console.error('Corrupted nomination result ', nwj);
            }
            return map;
        }, new Map<number, NominationResultJson>());
    }

    public static convertToPlayerObserved(registeredPlayersJson: RegisteredPlayerJson[]): Map<number, string> {
        return registeredPlayersJson.reduce((map, registeredPlayer) => {
            if (registeredPlayer.account_id && registeredPlayer.discordId) {
                map.set(registeredPlayer.account_id, registeredPlayer.discordId);
            } else {
                console.error('Corrupted Registered Player ', registeredPlayer);
            }
            return map;
        }, new Map<number, string>());
    }

    private static isValidNominationResult(nrj: NominationResultJson): boolean {
        return this.isDefined(nrj.nominationName)
            && this.isDefined(nrj.owner_account_id)
            && this.isDefined(nrj.score)
            && this.isDefined(nrj.timeClaimed);
    }

    private static isDefined(val: any): boolean {
        return val !== undefined && val !== null;
    }
}
