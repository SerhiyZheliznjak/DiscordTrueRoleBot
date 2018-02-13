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
    //15*60*1000
    Rx.Observable.interval(5 * 1000).subscribe(() => {
        nominatedScores = DataStore.getPlayersScore();
        accountIds.forEach(account_id => {
          let playerScore = nominatedScores.find(p => p.account_id === account_id);
          playerScore = !!playerScore ? playerScore : new PlayerScore(account_id);
          DotaApi.getRecentMatches(account_id).subscribe(matches => {
            matches.filter(match => !playerScore.getNominations().find(nomination => nomination.match_id === match.match_id))
              .forEach();
          });
        });
      });
  });
}

module.exports = {
  observe: observePlayers
};