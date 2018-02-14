const StorageService = require('./storage-service');
const PlayerScore = require('../model/PlayerScore');
const Nomination = require('../model/Nomination');
const CONST = require('../constants');
const DotaApi = require('../dota-api/dota-api');
const Rx = require('rxjs');

let playerScoreCache;
let matchesCache;

function initPlayersScoresCache() {
    if (!playerScoreCache) {
        playerScoreCache = convertToPlayersScores(StorageService.getPlayersScores());
    }
}

function getPlayersScores() {
    if (!playerScoreCache) {
        initPlayersScoresCache();
    }
    return playerScoreCache;
}

function convertToPlayersScores(storedObject) {
    const playersScores = [];
    if (!!storedObject) {
        for (account_id in storedObject) {
            if (storedObject.hasOwnProperty(account_id)) {
                const ps = new PlayerScore(account_id);
                ps.setPointsFromJsonObject(storedObject[account_id]);
                playersScores.push(ps);
            }
        }
    }
    return playersScores;
}

function updatePlayerScores(playerScore) {
    if (!playerScoreCache) {
        initPlayersScoresCache();
    }
    if (!!playerScore) {
        const existing = playerScoreCache.find(ps => ps.account_id === playerScore.account_id);
        if (!existing) {
            playerScoreCache.push(playerScore);
        } else {
            existing.updateNominations(playerScore.getNominations());
        }
    }
}

function savePlayersScores() {
    if (!!playerScoreCache) {
        StorageService.savePlayersScores(playerScoreCache)
    }
}

function getMatches() {
    if (!matchesCache) {
        matchesCache = [];
    }
    
    return matchesCache;
}

function addMatches(matchesToAdd) {
    if (!matchesCache) {
        getMatches();
    }
    matchesToAdd = matchesToAdd.filter(mta => !matchesCache.find(mc => mc.match_id === mta.match_id));
    matchesCache.push(...matchesToAdd);
    while (matchesCache.length > CONST.GetMaxMatches()) {
        matchesCache.shift();
    }
}

function getMatch(match_id) {
    return Rx.Observable.create(observer => {
        if (!matchesCache) {
            getMatches();
        }
        let match = matchesCache.find(m => m.match_id === match_id);
        if(!match) {
            DotaApi.getMatch(match_id).subscribe(m=>observer.next(m)); 
        } else {
            observer.next(match);
        }
    });
    
}

module.exports = {
    getPlayersScores: getPlayersScores,
    updatePlayerScores: updatePlayerScores,
    savePlayersScores: savePlayersScores,
    getMatches: getMatches,
    getMatch: getMatch,
    addMatches: addMatches
}