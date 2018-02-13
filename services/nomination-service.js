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
  //FIgure out with observables
  return Rx.Observable.create(observer => {
    const getRecentGamesObserver = {
      next: () => {
        nominatedScores = DataStore.getPlayersScores();
        Rx.Observable.forkJoin(accountIds.map(account_id => getAndStoreRecentMatches(account_id, nominatedScores)));
      }
    }
    Rx.Observable.interval(15 * 60 * 1000).subscribe(getRecentGamesObserver);
    getRecentGamesObserver.next();
  });
}

function getAndStoreRecentMatches(account_id, nominatedScores) {
  //FIgure out with observables
  return Rx.Observable.create(observer => {
    let playerScore = nominatedScores.find(p => p.account_id === account_id);
    playerScore = !!playerScore ? playerScore : new PlayerScore(account_id);
    DotaApi.getRecentMatches(account_id).subscribe(recentMatches => {
      const recentMatchesIds = recentMatches.map(m => m.match_id);
      const newMatches = recentMatchesIds.filter(match_id => !DataStore.getMatches().map(m => m.match_id).find(mid => mid === match_id));
      if (newMatches.length > 0) {
        DotaApi.getFullMatches(newMatches).subscribe(fullMatches => {
          DataStore.addMatches(fullMatches);
          if (playerScore.recentMatchesIds[playerScore.recentMatchesIds.length - 1] !== recentMatchesIds[recentMatchesIds.length - 1]) {
            playerScore.recentMatchesIds = recentMatchesIds;
            recentMatches.forEach(rm => {
              playerScore.getNominations().forEach(nomination=>{
                nomination.scoreMatch(DataStore.getMatch(rm.match_id), rm.player_slot);
              });
            });
            observer.next(playerScore);
          }
        });
      } else {
        observer.next(playerScore);
      }
    });
  });
}

module.exports = {
  observe: observePlayers
};