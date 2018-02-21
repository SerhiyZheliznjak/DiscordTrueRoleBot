import { Constants } from "../Constants";
import { existsSync, readFileSync, writeFileSync } from "fs";
import PlayerScoreJson from "../model/json/PlayerScoreJson";
import PlayerScore from "../model/PlayerScore";
import NominationWinner from "../model/NominationWinner";
import NominationWinnerJson from "../model/json/NominationWinnerJson";
import StorageConvertionUtil from "../utils/StorageConvertionUtil";

// const fs = require('fs');
// const CONST = require('../constants');

export default class StorageService {
    public static getPlayersScores(): PlayerScoreJson[] {
        return this.readFileToObject(Constants.PLAYERS_SCORES_FILE_PATH).table as PlayerScoreJson[];
    }

    public static savePlayersScores(palyersScores: Map<string, PlayerScore>) {
        this.writeArrayToFile(StorageConvertionUtil.convertToPlayersScoreJson(palyersScores), Constants.PLAYERS_SCORES_FILE_PATH);
    }

    public static saveWinners(winners: Map<string, NominationWinner>): void {
        this.writeArrayToFile(StorageConvertionUtil.convertToNominationWinnersJson(winners), Constants.WINNERS_FILE_PATH);
    }

    public static getWinners(): NominationWinnerJson[] {
        return this.readFileToObject(Constants.WINNERS_FILE_PATH).table as NominationWinnerJson[];
    }

    private static writeArrayToFile(array: any[], filePath: string) {
        this.createPathIfNeeded(filePath);
        if (!array || !array.length) {
            console.error('write empty array yourself');
            return;
        }
        writeFileSync(filePath,
            JSON.stringify({ table: array }),
            'utf8');
    }

    private static createPathIfNeeded(filePath) {
        const doesExist = existsSync(filePath);
        if (!doesExist) {
            const mkdirp = require('mkdirp');
            const pathToCreate = filePath.split('/');
            pathToCreate.pop();
            mkdirp(pathToCreate.join('/'));
        }
        return doesExist;
    }

    private static readFileToObject(filePath) {
        if (!this.createPathIfNeeded(filePath)) {
            return { table: [] };
        }
        return JSON.parse(readFileSync(filePath, 'utf8'));
    }


}

