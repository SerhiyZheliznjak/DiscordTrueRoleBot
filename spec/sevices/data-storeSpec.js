const Proxyquire = require('proxyquire');
const CONST = require('../../constants');
const PlayerScore = require('../../model/PlayerScore');
let DataStore;
let StorageServiceMock;
let DotaApiMock;

describe('StorageService', () => {
    beforeEach(() => {
        StorageServiceMock = jasmine.createSpyObj('StorageServiceMock', ['getPlayersScores', 'savePlayersScores']);
        DotaApiMock = jasmine.createSpyObj('DotaApiMock', ['getMatch']);
        DataStore = Proxyquire('../../services/data-store', { 
            './storage-service': StorageServiceMock,
        '../dota-api/dota-api': DotaApiMock
     });
    });

    it('should set players cashe to empty array if nothing stored', () => {
        expect(DataStore.getPlayersScores()).toEqual([]);
    });

    it('should read storage to fill players cashe', () => {
        const scores = [new PlayerScore('huy'), new PlayerScore("pezda")];
        StorageServiceMock.getPlayersScores.and.returnValue(JSON.parse(JSON.stringify({
            huy: scores[0].getNominations(),
            pezda: scores[1].getNominations()
        })));
        expect(DataStore.getPlayersScores()).toEqual(scores);
    });

    it('should update player score', () => {
        const initialScore = new PlayerScore('huy');
        const newScore = new PlayerScore('huy');
        newScore.getNominations()[0].addPoint('pezda', 100500);
        DataStore.updatePlayerScores(initialScore);
        expect(StorageServiceMock.getPlayersScores).toHaveBeenCalled();
        StorageServiceMock.getPlayersScores.calls.reset();
        DataStore.updatePlayerScores(newScore);
        expect(StorageServiceMock.getPlayersScores).not.toHaveBeenCalled();
        expect(DataStore.getPlayersScores()).toEqual([newScore]);
    });

    it('should not save empty player score cache', () => {
        DataStore.savePlayersScores();
        expect(StorageServiceMock.savePlayersScores).not.toHaveBeenCalled();
    });

    it('should not save player score cache', () => {
        const initialScore = new PlayerScore('huy');
        DataStore.updatePlayerScores(initialScore);
        DataStore.savePlayersScores();
        expect(StorageServiceMock.savePlayersScores).toHaveBeenCalledWith([initialScore]);
    });
});