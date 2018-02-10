'use strict';
const NominationsList = require('../model/NominationsList');

function getNominationsForPlayer(matches, player_slot) {
  const nominationsList = NominationsList.create();
  matches.forEach(match => nominationsList.forEach(nomination => nomination.scoreMatch(match, player_slot)));
  return nominationsList;
}

function nominate(players, relevantMatches) {

}

module.exports = {
  getNominationsForPlayer: getNominationsForPlayer
};