const RxHttpRequest = require('rx-http-request').RxHttpRequest;
const Rx = require('rxjs');

//emit value in sequence every 1 second
const source = Rx.Observable.interval(500);
const queue = [];   
const subscribe = source.subscribe(() => {
  if(queue.length > 0) {
    queue.shift()();
  }
});

let getPlayer = async function(id) {
  return RxHttpRequest.get(util.format('https://api.opendota.com/api/players/%s/', id));
};

let getLastMatchForPlayer = async function(playerId) {
  return RxHttpRequest.get(util.format('https://api.opendota.com/api/players/%s/matches?limit=1', playerId));
};

function getRecentMatches(player_id) {
  return RxHttpRequest.get(util.format('https://api.opendota.com/api/players/%s/recentMatches', player_id));
}

let getFullMatchDetails = async function(matchId) {
  return RxHttpRequest.get(util.format('https://api.opendota.com/api/matches/%s', matchId));
};

module.exports = {
  getPlayer: getPlayer,
  getLastMatchForPlayer: getLastMatchForPlayer,
  getFullMatchDetails: getFullMatchDetails
};