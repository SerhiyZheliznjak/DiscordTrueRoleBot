const AwardService = require('../../services/award-service');
const psJson = require('../test-data/players-scores.json');
const PlayerScore = require('../../model/PlayerScore');
let playersScores;

describe('AwardService', () => {
    beforeEach(() => {
        playersScores = convertToPlayersScores(psJson);
    });

    function convertToPlayersScores(storedObject) {
        const playersScores = [];
        if (!!storedObject) {
            for (account_id in storedObject) {
                if (storedObject.hasOwnProperty(account_id)) {
                    const ps = new PlayerScore(account_id);
                    ps.setPointsFromJsonObject(storedObject[account_id].nominations);
                    ps.recentMatchesIds = storedObject[account_id].recentMatchesIds;
                    playersScores.push(ps);
                }
            }
        }
        return playersScores;
    }

    it('should return empty array for empty array input', () => {
        expect(AwardService.getNominationsWinners([])).toEqual([]);
    });

    it('should return empty array if there were no new matches', () => {
        expect(AwardService.getNominationsWinners(convertToPlayersScores(psJson))).toEqual([]);
    });

    // it('should reaward everyone if at least one player has new games', () => {
    //     const playersScores = convertToPlayersScores(psJson);
    //     playersScores[0].hasNewMatches = true;
    //     expect(AwardService.getNominationsWinners(playersScores)).toEqual([
    //         { account_id: '298134653', nomination: getPlayerWinningNomination('298134653', 'Людогуб') },
    //         { account_id: '86848474', nomination: getPlayerWinningNomination('86848474', 'Блейд') },
    //         { account_id: '333303976', nomination: getPlayerWinningNomination('333303976', 'Донор') },
    //         { account_id: '298134653', nomination: getPlayerWinningNomination('298134653', 'Гнобитель Джунглів') },
    //     ]);
    // });

    function getPlayerWinningNomination(account_id, nominationName) {
        return playersScores.find(p => p.getAccountId() === account_id)
        .getNominations().find(n => n.getName() === nominationName);
    }
});