import { } from 'jasmine';
import ScoreBoardService from '../ScoreBoardService';
import Nominations from '../../model/Nominations';
import NominationResult from '../../model/NominationResult';
import Constants from '../../Constants';
import { MatchJson } from '../../dota-api/DotaJsonTypings';
import { PingMaster } from '../../model/nominations/PingMaster';
import { Donor } from '../../model/nominations/Donor';
import { Pacifist } from '../../model/nominations/Pacifist';

describe(`ScoreBoardService`, () => {
    let service: ScoreBoardService;
    let nominationResults: Map<number, NominationResult[]>;
    let fullMatch: MatchJson;
    let aegisFullMatch: MatchJson;
    beforeEach(() => {
        setupTestData();
        setupMocks();
        service = new ScoreBoardService();
    });

    it(`should initiate nomination results`, () => {
        nominationResults = service.initNominationResults();
        const allNominations = Nominations.all;
        expect(nominationResults.size).toEqual(allNominations.length);
        allNominations.forEach(nomination => {
            const nominationResult = nominationResults.get(nomination.getKey());
            expect(nominationResult).toEqual([]);
        });
    });

    it(`should applyPlayerData`, () => {
        nominationResults = Nominations.all.reduce((map, nomination) => {
            map.set(nomination.getKey(), [new NominationResult(Constants.UNCLAIMED, nomination)]);
            return map;
        }, new Map<number, NominationResult[]>());
        const fullMatches = [fullMatch, aegisFullMatch];
        service.applyPlayerData(1, fullMatches, nominationResults);
        service.applyPlayerData(2, fullMatches, nominationResults);
        service.applyPlayerData(3, fullMatches, nominationResults);
        expect();
    });

    it(`should `, () => {

    });

    function setupMocks() {

    }

    function setupTestData() {
        /* tslint:disable*/
        process.env.MONGODB_URI = 'Mongo/db';
        fullMatch = require('../../test-data/FullMatch.json');
        aegisFullMatch = require('../../test-data/AegisFullMatch.json');
        /* tslint:enable*/
    }
});
