import { Constants } from "../Constants";
import PlayerRecentMatchesJson from "../model/json/PlayerRecentMatchesJson";
import NominationWinner from "../model/NominationWinner";
import NominationWinnerJson from "../model/json/NominationWinnerJson";
import StorageConvertionUtil from "../utils/StorageConvertionUtil";
import { mkdirp } from "mkdirp";
import Pair from "../model/Pair";
import { MongoClient } from "mongodb";

export default class StorageService {
    constructor(private mongoClient = MongoClient) {
        this.initDB();
     }

    public getRecentMatches(): PlayerRecentMatchesJson[] {
        // return this.readFileToObject(Constants.RECENT_MATCHES).table;
        return null;
    }

    public saveRecentMatches(recentPlayerMatches: Map<number, number[]>): void {
        // this.writeArrayToFile(StorageConvertionUtil.convertToRecentMatchJson(recentPlayerMatches), Constants.RECENT_MATCHES);
    }

    public saveWinners(winners: Map<string, NominationWinner>): void {
        // this.writeArrayToFile(StorageConvertionUtil.convertToNominationWinnersJson(winners), Constants.WINNERS_FILE_PATH);
    }

    public getWinners(): NominationWinnerJson[] {
        // return this.readFileToObject(Constants.WINNERS_FILE_PATH).table;
        return null;
    }

    public getPlayersObserved(): Array<Pair<number, string>> {
        // return this.readFileToObject(Constants.PLAYERS_FILE_PATH).table;
        return null;
    }

    public savePlayersObserved(playersObserved: Map<number, string>): void {
        // this.writeArrayToFile(StorageConvertionUtil.convertToPlayersPairs(playersObserved), Constants.PLAYERS_FILE_PATH);
    }

    private initDB() {

    }
}
