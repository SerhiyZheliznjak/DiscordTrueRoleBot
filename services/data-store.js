const StorageService = require('./storage-service');
const PlayerScore = require('../model/PlayerScore');

let playerScoreCache;
let matchesCache;

function getPlayersScore() {
    if(!playerScoreCache) {
        const psFromStorage = StorageService.getPlayerScore().map(ps => new PlayerScore(ps.account_id, ps.nominations));
        playerScoreCache = !!psFromStorage ? psFromStorage : [];
    }
    return playerScoreCache;
}

function updatePlayerScore(playerScore) {
    if(!!playerScore) {
        playerScoreCache = getPlayerScore();
        const existing = playerScoreCache.find(ps=>ps.account_id === playerScore.account_id);
        if(!existing) {
            playerScoreCache.push(playerScore);
        } else {
            existing.nominations = playerScore.nominations;
        }
        StorageService.savePlayerScore(playerScore.toJSON())
    }
}

function getMatches() {
    if(!matchesCache) {
        const matchesFromStorage = matchesCache = StorageService.getMatches();
        matchesCache = !!matchesFromStorage ? matchesFromStorage : [];
    }
    return matchesCache;
}

function addMatch(match) {
    if(!matchesCache) {
        matchesCache = getMatches();
    }
    matchesCache.push(match);
    if(matchesCache.length > 80) {
        matchesCache.pop();
    }
    StorageService.saveMatch(match);
}

module.exports = {
    getPlayersScore: getPlayersScore,
    updatePlayerScore: updatePlayerScore,
    getMatches: getMatches,
    addMatch: addMatch
}