import {} from 'jasmine';
import NominationUtils from '../../utils/NominationUtils';
import { RecentMatchJson } from '../../dota-api/DotaJsonTypings';
import PlayerRecentMatches from '../../model/PlayerRecentMatches';
import Nomination from '../../model/Nomination';
import { Nenza } from '../../model/nominations/Nenza';
import NominationResult from '../../model/NominationResult';
import Constants from '../../Constants';
import { WinnerForLife } from '../../model/nominations/WinnerForLife';
import NominationResultJson from '../../model/json/NominationResultJson';

describe(`NominationUtils`, () => {
    let utils: NominationUtils;
    let oldMatches;
    let recentMatches: PlayerRecentMatches;
    let storedMatches: PlayerRecentMatches;
    let newWinner: NominationResult;
    let hallOfFameWinner: NominationResultJson;
    let hallOfFame: Map<number, NominationResultJson>;
    let newResults: Map<number, NominationResult>;

    beforeEach(() => {
        setupTestData();
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

    it(`should return false for hasNewMatches when all recent matches are stored`, () => {
        storedMatches.recentMatchesIds.push(...[0, 1, 2, 3, 4]);
        recentMatches.recentMatchesIds.push(...storedMatches.recentMatchesIds);

        expect(utils.hasNewMatches(recentMatches, storedMatches)).toBeFalsy();
    });

    it(`should return true for hasNewMatches when at least one recent matche isn't stored`, () => {
        storedMatches.recentMatchesIds.push(...[0, 1, 2, 3, 4]);
        recentMatches.recentMatchesIds.push(...storedMatches.recentMatchesIds);
        recentMatches.recentMatchesIds.push(5);

        expect(utils.hasNewMatches(recentMatches, storedMatches)).toBeTruthy();
    });

    it(`should getNewMatches return all recent matches if any of it new`, () => {
        storedMatches.recentMatchesIds.push(...[0, 1, 2, 3, 4]);
        recentMatches.recentMatchesIds.push(5, 6);
        expect(utils.getNewMatches(recentMatches, storedMatches)).toEqual(recentMatches);
    });

    it(`should getNewMatches return empty PlayerRecentMatches if there are no new matches`, () => {
        storedMatches.recentMatchesIds.push(...[0, 1, 2, 3, 4]);
        recentMatches.recentMatchesIds.push(...storedMatches.recentMatchesIds);

        expect(utils.getNewMatches(recentMatches, storedMatches)).toEqual(new PlayerRecentMatches(recentMatches.account_id, []));
    });

    it(`should return true for isClaimedNomination when not in hallOfFame`, () => {
        expect(utils.isClaimedNomination(newWinner, undefined)).toBeTruthy();
    });

    it(`should return true for isClaimedNomination when hallOfFame winner is out of due date`, () => {
        hallOfFameWinner.timeClaimed = new Date().getTime() - Constants.NOMINATION_DUE_INTERVAL;

        expect(utils.isClaimedNomination(newWinner, hallOfFameWinner)).toBeTruthy();
    });

    it(`should return true for isClaimedNomination when hallOfFame winner has no score and new winner has`, () => {
        newWinner.nomination.addPoint(5, 45);

        expect(utils.isClaimedNomination(newWinner, hallOfFameWinner)).toBeTruthy();
    });

    it(`should return true for isClaimedNomination when hallOfFame winner has lower score then new winner has`, () => {
        newWinner.nomination.addPoint(5, 45);
        hallOfFameWinner.score = 44;

        expect(utils.isClaimedNomination(newWinner, hallOfFameWinner)).toBeTruthy();
    });

    it(`should return flase for isClaimedNomination when hallOfFame winner has same score as new winner has`, () => {
        newWinner.nomination.addPoint(5, 45);
        hallOfFameWinner.score = 45;

        expect(utils.isClaimedNomination(newWinner, hallOfFameWinner)).toBeFalsy();
    });

    it(`should return flase for isClaimedNomination when it's the same result for same player, but just recalculated`, () => {
        [newWinner, hallOfFameWinner].forEach((winner, i) => {
            winner = new NominationResult(314684987, new WinnerForLife());
            winner.nomination.addPoint(444, 13);
            winner.nomination.timeClaimed = new Date().getTime() - (i * 1000 * 60 * 30);
        });
        expect(utils.isClaimedNomination(newWinner, hallOfFameWinner)).toBeFalsy();
    });

    it(`should return flase for isClaimedNomination when hallOfFame winner has score and new winner has not`, () => {
        hallOfFameWinner.score = 46;

        expect(utils.isClaimedNomination(newWinner, hallOfFameWinner)).toBeFalsy();
    });

    it(`should return empty array for getNewRecords if new results are empty`, () => {
        hallOfFame.set(0, hallOfFameWinner);
        expect(utils.getNewRecords(hallOfFame, newResults)).toEqual([]);
    });

    it(`should return empty array for getNewRecords if new results aren't scored`, () => {
        hallOfFame.set(0, hallOfFameWinner);
        newResults.set(1, newWinner);
        newResults.set(2, newWinner);
        newResults.set(3, newWinner);
        expect(utils.getNewRecords(hallOfFame, newResults)).toEqual([]);
    });

    it(`should return empty array for getNewRecords if new winner id equals unclaimed`, () => {
        hallOfFame.set(0, hallOfFameWinner);
        newWinner.account_id = Constants.UNCLAIMED;
        newWinner.nomination.addPoint(0, 100500);
        newResults.set(1, newWinner);
        newResults.set(2, newWinner);
        newResults.set(3, newWinner);
        expect(utils.getNewRecords(hallOfFame, newResults)).toEqual([]);
    });

    it(`should return winners for getNewRecords`, () => {
        hallOfFame.set(0, hallOfFameWinner);
        newWinner.nomination.addPoint(0, 100500);
        const almostWinner = new NominationResult(hallOfFameWinner.owner_account_id, new Nenza());
        almostWinner.nomination.addPoint(0, hallOfFameWinner.score);
        newResults.set(1, newWinner);
        newResults.set(2, newWinner);
        newResults.set(3, almostWinner);
        expect(utils.getNewRecords(hallOfFame, newResults)).toEqual([newWinner, newWinner]);
    });

    function setupTestData() {
        process.env.MONGODB_URI = 'Mongo/db';
        oldMatches = require('../../test-data/OstapRecentMatches.json').map(m => Object.assign({}, m));
        recentMatches = new PlayerRecentMatches(7, []);
        storedMatches = new PlayerRecentMatches(7, []);
        newWinner = new NominationResult(7, new Nenza());
        hallOfFameWinner = new NominationResultJson(1005629726, 'Nenza', 7, 0, new Date().getTime());
         // {
    //     "_id": {
    //         "$oid": "5ab555635ccb13ced433ca05"
    //     },
    //     "key": -347474430,
    //     "nominationName": "Пабідітіль па жизні",
    //     "owner_account_id": 314684987,
    //     "score": 13,
    //     "timeClaimed": 1521913843753
    // }
        hallOfFame = new Map();
        newResults = new Map();
    }
});
