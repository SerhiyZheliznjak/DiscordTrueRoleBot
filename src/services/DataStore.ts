import NominationResult from "../model/NominationResult";
import { MatchJson, ProfileJson, WinLossJson } from "../dota-api/DotaJsonTypings";
import StorageService from "./StorageService";
import { Observable } from "rxjs";
import DotaApi from "../dota-api/DotaApi";
import Nomination from "../model/Nomination";
import PlayerRecentMatches from "../model/PlayerRecentMatches";
import NominationResultJson from "../model/json/NominationResultJson";

export default class DataStore {
    public static maxMatches: number;
    private static matchesCacheMap: Map<number, MatchJson> = new Map();
    private static profilesMap: Map<number, ProfileJson>;
    private static registeredPlayersCache: Map<number, string> = new Map();

    constructor(
        private dotaApi: DotaApi = new DotaApi(),
        private storage: StorageService = new StorageService()
    ) { }

    public getRecentMatchesForPlayer(account_id: number): Observable<PlayerRecentMatches> {
        return this.storage.getRecentMatchesForPlayer(account_id);
    }

    public updatePlayerRecentMatch(account_id: number, matchesIds: number[]): void {
        this.storage.updateRecentMatchesForPlayer(account_id, matchesIds);
    }

    public get hallOfFame(): Observable<Map<number, NominationResultJson>> {
        return this.storage.getWinners();
    }

    public updateNominationResult(nominationResult: NominationResult): void {
        this.storage.updateNominationResult(nominationResult);
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
                if (m) {
                    this.addMatch(m);
                }
                return m;
            });
        } else {
            return Observable.of(match);

        }
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

    public get registeredPlayers(): Observable<Map<number, string>> {
        if (DataStore.registeredPlayersCache.size === 0) {
            return this.storage.getPlayersObserved().map(map => {
                DataStore.registeredPlayersCache = map;
                return map;
            });
        }
        return Observable.of(DataStore.registeredPlayersCache);
    }

    public registerPlayer(account_id: number, discordId: string): void {
        this.storage.registerPlayer(account_id, discordId);
    }

    public getWinLoss(account_id: number): Observable<WinLossJson> {
        return this.dotaApi.getWinLoss(account_id);
    }
}
