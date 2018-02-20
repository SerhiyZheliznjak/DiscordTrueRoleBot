const StorageService = require('./storage-service');
const PlayerScore = require('../model/PlayerScore');
const Nomination = require('../model/Nomination');
const NominationsList = require('../model/NominationsList');
const CONST = require('../constants');
const DotaApi = require('../dota-api/dota-api');
const Rx = require('rxjs');

let playerScoreCache;
let matchesCache;
let winnersCache;

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
                    updatePlayer(p);
                    playerObserver.next(p);
                    playerObserver.complete();
                });
        } else {
            playerObserver.next(player);
            playerObserver.complete();
        }
    });
}

function getPlayers(accountsIds) {
    return Rx.Observable.create(playersObserver => {
        subscriptionChain(
            accountsIds.map(account_id => getPlayer(account_id)),
            player => updatePlayer(player),
            () => {
                playersObserver.next(getPlayersCache());
                playersObserver.complete();
            });
    });
}

function subscriptionChain(observables, next, complete) {
    const nextObservable = observables.shift();
    if (nextObservable) {
        nextObservable.subscribe(result => {
            next(result);
            subscriptionChain(observables, next, complete);
        });
    } else {
        complete();
    }
}

function updatePlayer(player) {
    if (playersInfoCache && player) {
        const playerFromCache = playersInfoCache.find(pc => pc.account_id === player.account_id);
        if (playerFromCache) {
            playerFromCache.personaname = player.personaname;
            playerFromCache.name = player.name;
            playerFromCache.avatar = player.avatar;
            playerFromCache.avatarmedium = player.avatarmedium;
            playerFromCache.profileurl = player.profileurl;
            playerFromCache.last_login = player.last_login;
        } else {
            playersInfoCache.push(player);
        }
    } else {
        if (player) {
            playersInfoCache = [player];
        }
    }
}

function getPlayersCache() {
    return !!playersInfoCache ? playersInfoCache : [];
}
function saveWinnersScore(wonNominations) {
    winnersCache = wonNominations;
    StorageService.saveWinners(wonNominations);
}
function getWinnersScore() {
    if (!winnersCache) {
        winnersCache = StorageService.getWinnersScore().table;
    }
    return winnersCache;
}

const DataStore = {
    getPlayersScores: getPlayersScores,
    updatePlayerScores: updatePlayerScores,
    savePlayersScores: savePlayersScores,
    getMatches: getMatches,
    getMatch: getMatch,
    addMatches: addMatches,
    getPlayer: getPlayer,
    updatePlayer: updatePlayer,
    getPlayers: getPlayers,
    saveWinnersScore: saveWinnersScore,
    getWinnersScore: getWinnersScore
};

module.exports = DataStore;