'use strict';
const NominationsList = require('../model/NominationsList');
const DataStore = require('./data-store');
const Rx = require('rxjs');
const DotaApi = require('../dota-api/dota-api');
const PlayerScore = require('../model/PlayerScore');

let nominatedScores;

function getNominationsForPlayer(matches, player_slot) {
  const nominationsList = NominationsList.create();
  matches.forEach(match => nominationsList.forEach(nomination => nomination.scoreMatch(match, player_slot)));
  return nominationsList;
}

function observePlayers(accountIds) {
  return Rx.Observable.create(observer => {
    const getRecentGamesObserver = {
      next: () => {
        nominatedScores = DataStore.getPlayersScore();
        accountIds.forEach(account_id => {
          let playerScore = nominatedScores.find(p => p.account_id === account_id);
          playerScore = !!playerScore ? playerScore : new PlayerScore(account_id);
          getAndStoreRecentMatches(account_id);
        });
      }
    }
    Rx.Observable.interval(15 * 60 * 1000).subscribe(getRecentGamesObserver);
    getRecentGamesObserver.next();
  });
}

function getAndStoreRecentMatches(account_id) {
  DotaApi.getRecentMatches(account_id).subscribe(recentMatches => {
    const storedMatcheIds = DataStore.getMatches().map(m => m.match_id);
    const newMatches = recentMatches.map(m => m.match_id).filter(match_id => !storedMatcheIds.find(mid => mid === match_id));
    if(newMatches.length > 0) {
      DotaApi.getFullMatches(newMatches).subscribe(fullMatches => {
        DataStore.addMatches(fullMatches);
      });
    }
  });
}

module.exports = {
  observe: observePlayers
};