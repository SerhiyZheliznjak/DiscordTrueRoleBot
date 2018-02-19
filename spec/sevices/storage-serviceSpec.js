const fs = require('fs');
const StorageService = require('../../services/storage-service');
const CONST = require('../../constants');
const PlayerScore = require('../../model/PlayerScore');

describe('StorageService', () => {
    afterEach(() => {
        cleanUp();
    });
    it('should return empty array if nothing stored yet', () => {
        cleanUp();
        expect(StorageService.getPlayersScores()).toEqual([]);
    });

    it('should save player score', () => {
        const scores = [new PlayerScore('huy')];
        StorageService.savePlayersScores(scores);
        expect(readPlayersScoreFile()).toEqual(JSON.stringify({ huy: {recentMatchesIds:scores[0].recentMatchesIds, nominations:scores[0].getNominations() }}));
    });

    it('should read saved player score', () => {
        const scores = [new PlayerScore('huy')];
        StorageService.savePlayersScores(scores);
        expect(StorageService.getPlayersScores()).toEqual(JSON.parse(JSON.stringify({ huy: {recentMatchesIds:scores[0].recentMatchesIds, nominations:scores[0].getNominations() }})));
    });

    function readPlayersScoreFile() {
        return fs.readFileSync(CONST.PLAYERS_SCORES_FILE_PATH(), 'utf8', err => console.error(err));
    }

    function cleanUp() {
        if (fs.existsSync(CONST.PLAYERS_SCORES_FILE_PATH())) {
            fs.unlinkSync(CONST.PLAYERS_SCORES_FILE_PATH());
        }
    }
});