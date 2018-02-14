const Proxyquire = require('proxyquire');
const CONST = require('../../constants');
const PlayerScore = require('../../model/PlayerScore');
const Rx = require('rxjs');
let DataStore;
let StorageServiceMock;
let DotaApiMock;
const matchFromDotaApi = { match_id: 'dota-api-match' }

describe('StorageService', () => {
    beforeEach(() => {
        StorageServiceMock = jasmine.createSpyObj('StorageServiceMock', ['getPlayersScores', 'savePlayersScores']);
        DotaApiMock = jasmine.createSpyObj('DotaApiMock', ['getMatch']);
        DotaApiMock.getMatch.and.returnValue(Rx.Observable.create(obs => obs.next(matchFromDotaApi)));
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
        scores[0].recentMatchesIds = ['1', '2', '3'];
        scores[1].recentMatchesIds = ['3', '4', '5'];
        StorageServiceMock.getPlayersScores.and.returnValue(JSON.parse(JSON.stringify({
            huy: {recentMatchesIds:scores[0].recentMatchesIds, nominations:scores[0].getNominations()},
            pezda: {recentMatchesIds:scores[1].recentMatchesIds, nominations:scores[1].getNominations()}
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
        const firstScore = new PlayerScore('huy');
        const secondScore = new PlayerScore('pezda');
        DataStore.updatePlayerScores(firstScore);
        DataStore.updatePlayerScores(secondScore);
        DataStore.savePlayersScores();
        expect(StorageServiceMock.savePlayersScores).toHaveBeenCalledWith([firstScore, secondScore]);
    });

    it('should return match from dota-api if no local storage', () => {
        DataStore.getMatch('match_id').subscribe(match => {
            expect(match.match_id).toEqual(matchFromDotaApi.match_id);
            expect(DotaApiMock.getMatch).toHaveBeenCalledWith('match_id');
        });
    });

    it('should return match from local storage if it was already saved', () => {
        DataStore.getMatch(matchFromDotaApi.match_id).subscribe(match => {
            expect(match.match_id).toEqual(matchFromDotaApi.match_id);
            expect(DotaApiMock.getMatch).toHaveBeenCalledWith(matchFromDotaApi.match_id);
        });
        DotaApiMock.getMatch.calls.reset();
        DataStore.getMatch(matchFromDotaApi.match_id).subscribe(match => {
            expect(match.match_id).toEqual(matchFromDotaApi.match_id);
            expect(DotaApiMock.getMatch).not.toHaveBeenCalled();
        });
    });

});