import NominationWinner from "../model/NominationWinner";
import { MatchJson, ProfileJson, PlayerProfileJson } from "../dota-api/DotaJsonTypings";
import StorageService from "./StorageService";
import { Observable } from "rxjs";
import DotaApi from "../dota-api/DotaApi";
import Nomination from "../model/Nomination";

export default class DataStore {
    public static maxMatches: number;
    private static playersRecentMatchesCacheMap: Map<number, number[]> = new Map();
    private static matchesCacheMap: Map<number, MatchJson> = new Map();
    private static wonNominationsCacheMap: Map<string, NominationWinner> = new Map();
    private static profilesMap: Map<number, ProfileJson>;
    private static registeredPlayersCache: Map<number, string> = new Map();

    constructor(
        private dotaApi: DotaApi = new DotaApi(),
        private storage: StorageService = new StorageService()
    ) { }

    public get playersRecentMatches(): Observable<Map<number, number[]>> {
        if (DataStore.playersRecentMatchesCacheMap.size === 0) {
            return this.storage.getRecentMatches().map(map => {
                DataStore.playersRecentMatchesCacheMap = map;
                return map;
            });
        }
        return Observable.of(DataStore.playersRecentMatchesCacheMap);
    }

    public updatePlayerRecentMatches(account_id: number, matchesIds: number[]): void {
        this.playersRecentMatches.subscribe(map => map.set(account_id, matchesIds));
        this.storage.updatePlayerRecentMatches(account_id, matchesIds);
    }

    public get wonNominations(): Observable<Map<string, NominationWinner>> {
        if (DataStore.wonNominationsCacheMap.size === 0) {
            return this.storage.getWinners().map(map => {
                DataStore.wonNominationsCacheMap = map;
                return map;
            });
        }
        return Observable.of(DataStore.wonNominationsCacheMap);
    }

    public saveWinnersScore(recentWinners: Map<string, NominationWinner>): void {
        DataStore.wonNominationsCacheMap = recentWinners;
        this.storage.saveWinners(recentWinners);
    }

    public get matchesCache(): Map<number, MatchJson> {
        if (DataStore.matchesCacheMap.size === 0) {
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
            return Observable.of(match);

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
            return Observable.of(profile);
        } else {
            return this.dotaApi.getPlayerProfile(account_id)
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

    public get registeredPlayers(): Observable<Map<number, string>> {
        if (DataStore.registeredPlayersCache.size === 0) {
            return this.storage.getPlayersObserved().map(map => {
                DataStore.registeredPlayersCache = map;
                console.log("returning from db");
                return map;
            });
        }
        console.log("returning from cache", DataStore.registeredPlayersCache);
        return Observable.of(DataStore.registeredPlayersCache);
    }

    public registerPlayer(account_id: number, discordId: string): void {
        this.storage.registerPlayer(account_id, discordId);
    }
}
