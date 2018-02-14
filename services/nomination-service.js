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
  return Rx.Observable.create(playersObserver => {
    const getRecentGamesObserver = {
      next: () => {
        nominatedScores = DataStore.getPlayersScores();
        subscriptionChain(accountIds.map(account_id => getPlayerScoreForRecentMatches(account_id, nominatedScores)));

        function subscriptionChain(observables) {
          const nextObservable = observables.shift();
          if (nextObservable) {
            nextObservable.subscribe(playerScores => {
              DataStore.updatePlayerScores(playerScores);
              subscriptionChain(observables);
            });
          } else {
            console.log('Finished a run');
            DataStore.savePlayersScores();
            playersObserver.next(DataStore.getPlayersScores());
          }
        }
      }
    }
    Rx.Observable.interval(5 * 60 * 1000).subscribe(getRecentGamesObserver);
    getRecentGamesObserver.next();
  });
}

function getPlayerScoreForRecentMatches(account_id, nominatedScores) {
  return Rx.Observable.create(observer => {
    let playerScore = nominatedScores.find(p => p.getAccountId() === account_id);
    playerScore = !!playerScore ? playerScore : new PlayerScore(account_id);
    DotaApi.getRecentMatches(account_id).subscribe(recentMatches => {
      const recentMatchesIds = recentMatches.map(m => m.match_id);
      const unnominatedMatchesIds = playerScore.getUnnominatedMatches(recentMatchesIds);

      subscriptionChain(unnominatedMatchesIds.map(match_id => DataStore.getMatch(match_id)));

      function subscriptionChain(observables) {
        const nextObservable = observables.shift();
        if (nextObservable) {
          nextObservable.subscribe(fullMatch => {
            playerScore.getNominations().forEach(
              nomination => nomination.scoreMatch(fullMatch, recentMatches.find(rm => rm.match_id === fullMatch.match_id).player_slot)
            );
            subscriptionChain(observables);
          });
        } else {
          playerScore.recentMatchesIds = recentMatchesIds;
          console.log('Finished scoring player ', account_id);
          observer.next(playerScore);
          observer.complete();
        }
      }
    });
  });
}

module.exports = {
  observe: observePlayers
};