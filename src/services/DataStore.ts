import PlayerScore from "../model/PlayerScore";
import NominationWinner from "../model/NominationWinner";
import { MatchJson, ProfileJson } from "../dota-api/DotaJsonTypings";
import PlayerScoreJson from "../model/json/PlayerScoreJson";
import StorageService from "./StorageService";
import { Constants } from "../Constants";
import { Observable } from "rxjs";
import DotaApi from "../dota-api/DotaApi";
import StorageConvertionUtil from "../utils/StorageConvertionUtil";
import MyUtils from "../utils/MyUtils";

export default class DataStore {
    private static playersScoresCacheMap: Map<string, PlayerScore>;
    private static matchesCacheMap: Map<number, MatchJson>;
    private static wonNominationsCacheMap: Map<string, NominationWinner>;
    private static profilesMap: Map<number, ProfileJson>;
    public static maxMatches: number;

    public static get playersScoresCache(): Map<string, PlayerScore> {
        if (!this.playersScoresCacheMap) {
            this.playersScoresCacheMap = StorageConvertionUtil.convertToPlayersScores(StorageService.getPlayersScores());
        }
        return this.playersScoresCacheMap;
    }

    public static updatePlayerScore(account_id: string, playerScore: PlayerScore): void {
        if (!!playerScore) {
            const existing = this.playersScoresCache.get(account_id);
            if (!existing) {
                this.playersScoresCache.set(account_id, playerScore);
            } else {
                existing.nominations = playerScore.nominations;
            }
        }
    }

    public static savePlayersScores(): void {
        if (this.playersScoresCache.size > 0) {
            StorageService.savePlayersScores(this.playersScoresCache);
        }
    }

    public static get wonNominationCache(): Map<string, NominationWinner> {
        if (!this.wonNominationsCacheMap) {
            this.wonNominationsCacheMap = StorageConvertionUtil.convertToWonNominations(StorageService.getWinners());
        }
        return this.wonNominationsCacheMap;
    }

    public static saveWinnersScore(): void {
        StorageService.saveWinners(this.wonNominationCache);
    }

    public static get matchesCache(): Map<number, MatchJson> {
        if (!this.matchesCacheMap) {
            this.matchesCacheMap = new Map<number, MatchJson>();
        }
        return this.matchesCacheMap;
    }

    public static addMatches(matches: MatchJson[]): void {
        matches.forEach(match => this.addMatch(match));
    }

    public static addMatch(match: MatchJson): void {
        if (!this.matchesCache.get(match.match_id)) {
            this.matchesCache.set(match.match_id, match);
            if (this.maxMatches) {
                this.matchesCache.delete(this.matchesCache.keys().next().value);
            }
        }
    }

    public static getMatch(match_id): Observable<MatchJson> {
        return Observable.create(observer => {
            let match = this.matchesCache.get(match_id);
            if (!match) {
                DotaApi.getMatch(match_id).subscribe(m => {
                    this.matchesCache.set(match_id, m);
                    observer.next(m);
                    observer.complete();
                });
            } else {
                observer.next(match);
                observer.complete();
            }
        });
    }

    public static get profilesCache(): Map<number, ProfileJson> {
        if (!this.profilesMap) {
            this.profilesMap = new Map<number, ProfileJson>();
        }
        return this.profilesMap;
    }

    public static getProfile(account_id: number): Observable<ProfileJson> {
        return Observable.create(profileObserver => {
            let profile = this.profilesCache.get(account_id);
            if (!profile) {
                DotaApi.getPlayerProfile(account_id)
                    .map(p => p.profile)
                    .subscribe(p => {
                        this.profilesCache.set(account_id, profile);
                        profileObserver.next(p);
                        profileObserver.complete();
                    },
                        err => profileObserver.error(err));
            } else {
                profileObserver.next(profile);
                profileObserver.complete();
            }
        });
    }

    public static getPlayers(accountsIds) {
        return Observable.create(playersObserver => {
            MyUtils.subscriptionChain(
                accountsIds.map(account_id => this.getProfile(account_id)),
                (profile: ProfileJson) => this.profilesCache.set(profile.account_id, profile),
                () => {
                    playersObserver.next(this.profilesCache);
                    playersObserver.complete();
                });
        });
    }
}