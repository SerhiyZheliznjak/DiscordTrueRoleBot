import { Constants } from "../Constants";
import { existsSync, readFileSync, writeFileSync } from "fs";
import PlayerRecentMatchesJson from "../model/json/PlayerRecentMatchesJson";
import NominationWinner from "../model/NominationWinner";
import NominationWinnerJson from "../model/json/NominationWinnerJson";
import StorageConvertionUtil from "../utils/StorageConvertionUtil";
import { mkdirp } from "mkdirp";

export default class StorageService {
    constructor(private exists = existsSync,
        private readFile = readFileSync,
        private writeFile = writeFileSync,
        private mkdir = mkdirp) { }

    public getRecentMatches(): PlayerRecentMatchesJson[] {
        return this.readFileToObject(Constants.RECENT_MATCHES).table;
    }

    public saveRecentMatches(recentPlayerMatches: Map<number, number[]>): void {
        this.writeArrayToFile(StorageConvertionUtil.convertToRecentMatchJson(recentPlayerMatches), Constants.RECENT_MATCHES);
    }

    public saveWinners(winners: Map<string, NominationWinner>): void {
        this.writeArrayToFile(StorageConvertionUtil.convertToNominationWinnersJson(winners), Constants.WINNERS_FILE_PATH);
    }

    public getWinners(): NominationWinnerJson[] {
        return this.readFileToObject(Constants.WINNERS_FILE_PATH).table;
    }

    private writeArrayToFile(array: any[], filePath: string): void {
        this.createPathIfNeeded(filePath);
        if (!array || !array.length) {
            console.error('write empty array yourself');
            return;
        }
        this.writeFile(filePath,
            JSON.stringify({ table: array }),
            'utf8');
    }

    private createPathIfNeeded(filePath): boolean {
        const doesExist = this.exists(filePath);
        if (!doesExist) {
            const pathToCreate = filePath.split('/');
            pathToCreate.pop();
            this.mkdir(pathToCreate.join('/'));
        }
        return doesExist;
    }

    private readFileToObject(filePath) {
        if (!this.createPathIfNeeded(filePath)) {
            return { table: [] };
        }
        return JSON.parse(this.readFile(filePath, 'utf8'));
    }
}

