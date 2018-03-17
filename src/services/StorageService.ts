import Constants from "../Constants";
import PlayerRecentMatchesJson from "../model/json/PlayerRecentMatchesJson";
import NominationResult from "../model/NominationResult";
import NominationResultJson from "../model/json/NominationResultJson";
import StorageConvertionUtil from "../utils/StorageConvertionUtil";
import Pair from "../model/Pair";
import { MongoClient, MongoCallback, MongoError, Db, Collection } from "mongodb";
import { Observable, Observer } from "rxjs";
import { IDBKey } from "../model/json/IDBKey";
import RegisteredPlayerJson from "../model/json/RegisteredPlayerJson";
import PlayerRecentMatches from "../model/PlayerRecentMatches";

export default class StorageService {
    constructor(
        private mongoClient = MongoClient,
        private url: string = Constants.MONGODB_URI,
        private dbName: string = Constants.MONGODB_DB_NAME
    ) { }

    public getRecentMatchesForPlayer(account_id: number): Observable<PlayerRecentMatches> {
        return this.find<PlayerRecentMatchesJson>(Constants.RECENT_MATCHES_COLLECTION, { key: account_id })
            .map(json => StorageConvertionUtil.convertToPlayersRecentMatches(json[0])
            );
    }

    public getWinners(): Observable<Map<number, NominationResult>> {
        return this.find<NominationResultJson>(Constants.HALL_OF_FAME_COLLECTION)
            .map(json => StorageConvertionUtil.convertToWonNominations(json));
    }

    public getPlayersObserved(): Observable<Map<number, string>> {
        return this.find<RegisteredPlayerJson>(Constants.PLAYERS_COLLECTION)
            .map(json => StorageConvertionUtil.convertToPlayerObserved(json));
    }

    public updateRecentMatchesForPlayer(account_id: number, matchesIds: number[]): void {
        this.update(
            Constants.RECENT_MATCHES_COLLECTION,
            StorageConvertionUtil.convertToRecentMatchJson(account_id, matchesIds));
    }

    public updateNominationResult(result: NominationResult): void {
        this.update(
            Constants.HALL_OF_FAME_COLLECTION,
            StorageConvertionUtil.convertToNominationResultJson(result));
    }

    public registerPlayer(account_id: number, discordId: string): void {
        this.update(
            Constants.PLAYERS_COLLECTION,
            new RegisteredPlayerJson(account_id, discordId));
    }

    private get client(): Observable<MongoClient> {
        return Observable.create(clientObserver => this.connectLoop(clientObserver, 5));
    }

    private connectLoop(clientObserver: Observer<MongoClient>, retryCount: number) {
        this.mongoClient.connect(this.url, (err: MongoError, client: MongoClient) => {
            if (err !== null) {
                this.connectLoop(clientObserver, retryCount);
            } else {
                clientObserver.next(client);
                clientObserver.complete();
            }
        });
    }

    private find<T>(collectionName: string, query?): Observable<T[]> {
        return Observable.create((subscriber: Observer<T[]>) => {
            this.client.subscribe(client => {
                const db = client.db(this.dbName);
                Observable.fromPromise(db.collection(collectionName).find(query).toArray())
                    .subscribe((docs: T[]) => {
                        subscriber.next(docs);
                        subscriber.complete();
                        client.close();
                    });
            });
        });
    }

    private update(collectionName: string, document: IDBKey): void {
        this.client.subscribe(client => {
            const db = client.db(this.dbName);
            db.collection(collectionName).update({ key: document.key }, document, { upsert: true });
        });
    }
}
