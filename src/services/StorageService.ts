import Constants from "../Constants";
import PlayerRecentMatchesJson from "../model/json/PlayerRecentMatchesJson";
import NominationWinner from "../model/NominationWinner";
import NominationWinnerJson from "../model/json/NominationWinnerJson";
import StorageConvertionUtil from "../utils/StorageConvertionUtil";
import Pair from "../model/Pair";
import { MongoClient, MongoCallback, MongoError, Db, Collection } from "mongodb";
import { Observable, Observer } from "rxjs";
import { IDBKey } from "../model/json/IDBKey";

export default class StorageService {
    constructor(
        private mongoClient = MongoClient,
        private url: string = Constants.MONGODB_URI,
        private dbName: string = Constants.MONGODB_DB_NAME
    ) { }

    public getRecentMatches(): Observable<Map<number, number[]>> {
        return this.find<PlayerRecentMatchesJson>(Constants.RECENT_MATCHES_COLLECTION)
            .map(json => StorageConvertionUtil.convertToPlayersRecentMatchesMap(json));
    }

    public getWinners(): Observable<Map<string, NominationWinner>> {
        return this.find<NominationWinnerJson>(Constants.HALL_OF_FAME_COLLECTION)
            .map(json => StorageConvertionUtil.convertToWonNominations(json));
    }

    public getPlayersObserved(): Observable<Map<number, string>> {
        return this.find<Pair<number, string>>(Constants.PLAYERS_COLLECTION)
            .map(json => StorageConvertionUtil.convertToPlayerObserved(json));
    }

    public updatePlayerRecentMatches(account_id: number, matchesIds: number[]): void {
        this.update(
            Constants.RECENT_MATCHES_COLLECTION,
            [StorageConvertionUtil.convertToRecentMatchJson(account_id, matchesIds)]);
    }

    public saveWinners(winners: Map<string, NominationWinner>): void {
        this.update(
            Constants.HALL_OF_FAME_COLLECTION,
            StorageConvertionUtil.convertToNominationWinnersJson(winners));
    }

    public registerPlayer(account_id: number, discordId: string): void {
        this.update(
            Constants.PLAYERS_COLLECTION,
            [StorageConvertionUtil.convertToPair(account_id, discordId)]);
    }

    private get client(): Observable<MongoClient> {
        return Observable.create(clientObserver => {
            this.mongoClient.connect(this.url, (err: MongoError, client: MongoClient) => {
                clientObserver.next(client);
                clientObserver.complete();
            });
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

    private update(collectionName: string, documents: IDBKey[]): void {
        this.client.subscribe(client => {
            const db = client.db(this.dbName);
            documents.forEach(doc => {
                db.collection(collectionName).update({key: doc.key}, doc, { upsert: true });
            });
        });
    }
}
