const RxHttpRequest = require('rx-http-request').RxHttpRequest;
const Rx = require('rxjs');
const util = require('util');

const queue = [];

Rx.Observable.interval(400).subscribe(
  () => {
    if (queue.length > 0) {
      const nextRequest = queue.shift();
      RxHttpRequest.get(nextRequest.url).subscribe(
        data => {
          nextRequest.observer.next((JSON.parse(data.body)));
          nextRequest.observer.complete();
        },
        err => console.dir(err),
        () => console.log(nextRequest.url + ': complete')
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

function getFullMatchDetails(match_id) {
  return queueRequest(util.format('https://api.opendota.com/api/matches/%s', match_id));
};

const DotaApi = {
  getRecentMatches: getRecentMatches
};

module.exports = DotaApi