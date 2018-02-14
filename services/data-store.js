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
                ps.setPointsFromJsonObject(storedObject[account_id].nominations);
                ps.recentMatchesIds = storedObject[account_id].recentMatchesIds;
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
        const existing = playerScoreCache.find(ps => ps.getAccountId() === playerScore.getAccountId());
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
        if (!match) {
            DotaApi.getMatch(match_id).subscribe(m => {
                matchesCache.push(m);
                observer.next(m);
                observer.complete();
            });
        } else {
            observer.next(match);
            observer.complete();
        }
    });
}

let playersInfoCache;
function getPlayer(account_id) {
    return Rx.Observable.create(playerObserver => {
        if (!playersInfoCache) {
            playersInfoCache = StorageService.getPlayers();
        }
        let player = playersInfoCache.find(p => p.account_id === account_id);
        if (!player) {
            DotaApi.getPlayer(account_id)
            .map(p => p.profile)
            .subscribe(p => {
                playersInfoCache.push(p);
                playerObserver.next(p);
                playerObserver.complete();
            });
        } else {
            playerObserver.next(player);
            playerObserver.complete();
        }
    });
}

function updatePlayer(player) {

}

function getPlayers() {
    return !!playersInfoCache ? playersInfoCache : [];
}

const DataStore = {
    getPlayersScores: getPlayersScores,
    updatePlayerScores: updatePlayerScores,
    savePlayersScores: savePlayersScores,
    getMatches: getMatches,
    getMatch: getMatch,
    addMatches: addMatches,
    getPlayer: getPlayer,
    updatePlayer: updatePlayer
};

module.exports = DataStore;