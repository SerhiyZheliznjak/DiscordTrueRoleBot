const RxHttpRequest = require('rx-http-request').RxHttpRequest;
const Rx = require('rxjs');
const util = require('util');

const queue = [];

Rx.Observable.interval(400).subscribe(
  () => {
    if (queue.length > 0) {
      const nextRequest = queue.shift();
      RxHttpRequest.get(nextRequest.url).
        map(data => JSON.parse(data.body)).subscribe(
          obj => {
            nextRequest.observer.next(obj);
            nextRequest.observer.complete();
          },
          err => console.log(nextRequest.url, err),
          () => console.log(nextRequest.url, ': complete')
        );
    }
  },
  err => console.dir(err),
  () => console.log('interval complete')
);

function queueRequest(url) {
  return Rx.Observable.create(observer => {
    queue.push({
      url: url,
      observer: observer
    });
  });
}

function getPlayer(account_id) {
  return queueRequest(util.format('https://api.opendota.com/api/players/%s/', account_id));
};

function getRecentMatches(account_id) {
  return queueRequest(util.format('https://api.opendota.com/api/players/%s/recentMatches', account_id));
}

function getFullMatches(matcheIds) {
  const formatedUrls = matcheIds.map(match_id => util.format('https://api.opendota.com/api/matches/%s', match_id));
  return Rx.Observable.forkJoin(formatedUrls.map(url => queueRequest(url)));
};

function getMatch(match_id) {
  return queueRequest(util.format('https://api.opendota.com/api/matches/%s', match_id));
}

const DotaApi = {
  getPlayer: getPlayer,
  getRecentMatches: getRecentMatches,
  getFullMatches: getFullMatches,
  getMatch: getMatch
};

module.exports = DotaApi