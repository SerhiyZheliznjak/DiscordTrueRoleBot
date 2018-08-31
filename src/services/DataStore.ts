import NominationResult from "../model/NominationResult";
import { MatchJson, ProfileJson, WinLossJson, TeamJson } from "../dota-api/DotaJsonTypings";
import StorageService from "./StorageService";
import { Observable } from "rxjs";
import DotaApi from "../dota-api/DotaApi";
import PlayerRecentMatches from "../model/PlayerRecentMatches";
import NominationResultJson from "../model/json/NominationResultJson";

export default class DataStore {
    public static matchesCacheSize: number;
    private static matchesCacheMap: Map<number, MatchJson> = new Map();
    private static profilesMap: Map<number, ProfileJson>  = new Map();
    private static registeredPlayersCache: Map<number, string> = new Map();
    private static heroes: Map<string, number> = new Map();

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
            if (DataStore.matchesCacheSize) {
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

    public getProfile(account_id: number): Observable<ProfileJson> {
        const profile =  DataStore.profilesMap.get(account_id);
        if (profile) {
            return Observable.of(profile);
        } else {
            return this.dotaApi.getPlayerProfile(account_id)
                .map(p => {
                    DataStore.profilesMap.set(account_id, p.profile);
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

    public getWinLoss(account_id: number, hero_id?: number, with_ids?: number[], without_ids?: number[]): Observable<WinLossJson> {
        return this.dotaApi.getWinLoss(account_id, hero_id, with_ids, without_ids);
    }

    public getHeroId(name: string): Observable<number> {
        if (DataStore.heroes.size === 0) {
            return this.getHeroes().map(map => map.get(name));
        } else {
            return Observable.of(DataStore.heroes.get(name));
        }
    }

    public getHeroes(): Observable<Map<string, number>> {
        if (DataStore.heroes.size === 0) {
            return this.dotaApi.getHeroes().map(heroes => heroes.reduce((map, h) =>
                map.set(h.localized_name.split(/['-\s]/).join(''), h.id), DataStore.heroes));
        } else {
            return Observable.of(DataStore.heroes);
        }
    }

    public getTeams(): Observable<TeamJson[]> {
        const lastYear = new Date().getMilliseconds() - 1000 * 60 * 60 * 24 * 356;
        return this.dotaApi.getTeams();
    }
}
