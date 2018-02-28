import NominationWinner from "../model/NominationWinner";
import { RecentMatchJson, MatchJson, ProfileJson, PlayerProfileJson } from "../dota-api/DotaJsonTypings";
import StorageService from "./StorageService";
import { Constants } from "../Constants";
import { Observable } from "rxjs";
import DotaApi from "../dota-api/DotaApi";
import StorageConvertionUtil from "../utils/StorageConvertionUtil";
import { Nomination } from "../model/Nomination";

export default class DataStore {
    public static maxMatches: number;
    private static playerRecentMatchesCacheMap: Map<number, number[]>;
    private static matchesCacheMap: Map<number, MatchJson>;
    private static wonNominationsCacheMap: Map<string, NominationWinner>;
    private static profilesMap: Map<number, ProfileJson>;

    constructor(
        private dotaApi: DotaApi = new DotaApi(),
        private storage: StorageService = new StorageService()
    ) { }

    public get playerRecentMatchesCache(): Map<number, number[]> {
        if (!DataStore.playerRecentMatchesCacheMap) {
            DataStore.playerRecentMatchesCacheMap = StorageConvertionUtil.convertToPlayerRecentMatches(this.storage.getRecentMatches());
        }
        return DataStore.playerRecentMatchesCacheMap;
    }

    public updatePlayerRecentMatches(account_id: number, matchesIds: number[]): void {
        this.playerRecentMatchesCache.set(account_id, matchesIds);
    }

    public saveRecentMatches() {
        this.storage.saveRecentMatches(this.playerRecentMatchesCache);
    }

    public get wonNominationCache(): Map<string, NominationWinner> {
        if (!DataStore.wonNominationsCacheMap) {
            DataStore.wonNominationsCacheMap = StorageConvertionUtil.convertToWonNominations(this.storage.getWinners());
        }
        return DataStore.wonNominationsCacheMap;
    }

    public saveWinnersScore(recentWinners: Map<string, NominationWinner>): void {
        DataStore.wonNominationsCacheMap = recentWinners;
        this.storage.saveWinners(recentWinners);
    }

    public get matchesCache(): Map<number, MatchJson> {
        if (!DataStore.matchesCacheMap) {
            DataStore.matchesCacheMap = new Map<number, MatchJson>();
        }
        return DataStore.matchesCacheMap;
    }

    public addMatch(match: MatchJson): void {
        if (!this.matchesCache.get(match.match_id)) {
            this.matchesCache.set(match.match_id, match);
            if (DataStore.maxMatches) {
                this.matchesCache.delete(this.matchesCache.keys().next().value);
            }
        }
    }

    public getMatch(match_id): Observable<MatchJson> {
        const match = this.matchesCache.get(match_id);
        if (!match) {
            return this.dotaApi.getMatch(match_id).map(m => {
                this.addMatch(m);
                return m;
            });
        } else {
            return Observable.create(getMatchObserver => {
                getMatchObserver.next(match);
                getMatchObserver.complete();
            });

        }
    }

    public getMatches(matchesIds: number[]): Observable<MatchJson[]> {
        return Observable.forkJoin(matchesIds.map(match_id => this.getMatch(match_id)));
    }

    public get profilesCache(): Map<number, ProfileJson> {
        if (!DataStore.profilesMap) {
            DataStore.profilesMap = new Map<number, ProfileJson>();
        }
        return DataStore.profilesMap;
    }

    public getProfile(account_id: number): Observable<ProfileJson> {
        const profile = this.profilesCache.get(account_id);
        if (profile) {
            return Observable.create(profileObserver => {
                profileObserver.next(profile);
                profileObserver.complete();
            });
        } else {
            this.dotaApi.getPlayerProfile(account_id)
                .map(p => {
                    this.profilesCache.set(account_id, profile);
                    return p.profile;
                });
        }

    }

    public getPlayers(accountsIds: number[]): Observable<ProfileJson[]> {
        return Observable.forkJoin(
            accountsIds.map(account_id => this.dotaApi.getPlayerProfile(account_id).map((ppj: PlayerProfileJson) => ppj.profile))
        );
    }
}
