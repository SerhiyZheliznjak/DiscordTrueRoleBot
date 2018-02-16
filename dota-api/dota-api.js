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
          let obj;
          try {
            obj = JSON.parse(data.body);           
          } catch (err) {
            console.error(err, nextRequest.url, '. response data: ', data.body);
            queue.push({
              url: nextRequest.url,
              observer: nextRequest.observer
            });
          }
          if(obj) {
            nextRequest.observer.next(obj);
            nextRequest.observer.complete();
          }
        },
        err => {
          console.log(nextRequest.url, err);
          nextRequest.observer.next({});
          nextRequest.observer.complete();
        },
        () => { }
      );
    }
  },
  err => console.dir(err),
  () => console.log('interval complete')
);

function retry(url, retryCount, observer) {
  if (retryCount > 0) {
    retryCount--;

  } else {
    console.err('Failed getting ', url);
  }
}

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

function getPlayer(account_id) {
  return queueRequest(util.format('https://api.opendota.com/api/players/%s', account_id));
}

const DotaApi = {
  getPlayer: getPlayer,
  getRecentMatches: getRecentMatches,
  getFullMatches: getFullMatches,
  getMatch: getMatch,
  getPlayer: getPlayer

};

module.exports = DotaApi