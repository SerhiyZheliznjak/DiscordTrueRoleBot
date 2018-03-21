import {} from 'jasmine';
import NominationUtils from '../../utils/NominationUtils';
import { RecentMatchJson } from '../../dota-api/DotaJsonTypings';
import PlayerRecentMatches from '../../model/PlayerRecentMatches';

describe(`NominationUtils`, () => {
    let utils: NominationUtils;
    let oldMatches;
    let recentMatches: PlayerRecentMatches;
    let storedMatches: PlayerRecentMatches;

    beforeEach(() => {
        setupTestData();
        setupMocks();
        utils = new NominationUtils();
    });

    it(`should treat match that was held less than a week ago as fresh`, () => {
        oldMatches.forEach((match: RecentMatchJson, i: number) => {
            match.start_time = (new Date().getTime() / 1000) - (i * 60 * 60 * 24);
            const isFresh = utils.isFreshMatch(match);
            if (i < 14) {
                expect(isFresh).toBeTruthy();
            } else {
                expect(isFresh).toBeFalsy();
            }
        });
    });

    it(`should NOT treat match that was held more than a week ago as fresh`, () => {
        oldMatches.forEach(element => {
            expect(utils.isFreshMatch(element)).toBeFalsy();
        });
    });

    it(`should return true for hasNewMatches when recent matches aren't empty and stored are`, () => {
        recentMatches.recentMatchesIds.push(...[0, 1, 2, 3, 4]);
        expect(utils.hasNewMatches(recentMatches, storedMatches)).toBeTruthy();
    });

    it(`should return false for hasNewMatches when recent and stored matches are empty`, () => {
        expect(utils.hasNewMatches(recentMatches, storedMatches)).toBeFalsy();
    });

    it(`should return false for hasNewMatches when stored matches aren't empty and recent are`, () => {
        storedMatches.recentMatchesIds.push(...[0, 1, 2, 3, 4]);
        expect(utils.hasNewMatches(recentMatches, storedMatches)).toBeFalsy();
    });

    it(`should hasNewMatches`, () => {

    });

    it(`should hasNewMatches`, () => {

    });

    it(`should hasNewMatches`, () => {

    });

    function setupMocks() {

    }

    function setupTestData() {
        process.env.MONGODB_URI = 'Mongo/db';
        oldMatches = require('../../test-data/OstapRecentMatches.json').map(m => Object.assign({}, m));
        recentMatches = new PlayerRecentMatches(7, []);
        storedMatches = new PlayerRecentMatches(7, []);
    }
});
