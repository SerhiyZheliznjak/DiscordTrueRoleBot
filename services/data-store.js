const StorageService = require('./storage-service');
const PlayerScore = require('../model/PlayerScore');
const CONST = require('../constants');

let playerScoreCache;
let matchesCache;

function getPlayersScore() {
    if (!playerScoreCache) {
        const psFromStorage = StorageService.getPlayerScore().map(ps => new PlayerScore(ps.account_id, ps.nominations));
        playerScoreCache = !!psFromStorage ? psFromStorage : [];
    }
    return playerScoreCache;
}

function updatePlayerScore(playerScore) {
    if (!!playerScore) {
        playerScoreCache = getPlayerScore();
        const existing = playerScoreCache.find(ps => ps.account_id === playerScore.account_id);
        if (!existing) {
            playerScoreCache.push(playerScore);
        } else {
            existing.nominations = playerScore.nominations;
        }
        StorageService.savePlayerScore(playerScore.toJSON())
    }
}

function getMatches() {
    if (!matchesCache) {
        const matchesFromStorage = matchesCache = StorageService.getMatches();
        matchesCache = !!matchesFromStorage ? matchesFromStorage : [];
    }
    return matchesCache;
}

function addMatches(matchesToAdd) {
    if (!matchesCache) {
        matchesCache = getMatches();
    }
    matchesToAdd = matchesToAdd.filter(mta => !matchesCache.find(mc => mc.match_id === mta.match_id));
    matchesCache.push(...matchesToAdd);
    while(matchesCache.length > CONST.GetMaxMatches()) {
        matchesCache.shift();
    }
    StorageService.saveMatches(matchesToAdd);
}

module.exports = {
    getPlayersScore: getPlayersScore,
    updatePlayerScore: updatePlayerScore,
    getMatches: getMatches,
    addMatches: addMatches
}