import RxHttpRequest from 'rx-http-request';
import { Observable, Subscription, Observer } from 'rxjs';
import { format } from 'util';
import RecentMatchJson, { PlayerProfileJson, MatchJson } from './DotaJsonTypings';

class QueuedRequest {
  constructor(public url: string, public observer: Observer<any>, public retryCount: number) { }
}

export default class DotaApi {
  private static queue: QueuedRequest[] = [];
  private static queueSubscription: Subscription;

  private static moveQueue() {
    this.queueSubscription = Observable.interval(400).subscribe(
      () => {
        if (this.queue.length > 0) {
          const nextRequest = this.queue.shift();
          if (nextRequest.retryCount === 0) {
            nextRequest.observer.error('Failed to fetch from ' + nextRequest.url);
          }
          RxHttpRequest.get(nextRequest.url).subscribe(
            data => {
              let obj;
              try {
                obj = JSON.parse(data.body);
              } catch (err) {
                console.error(err, nextRequest.url, '. response data: ', data.body);
                this.retry(nextRequest);
              }
              if (obj) {
                nextRequest.observer.next(obj);
                nextRequest.observer.complete();
              }
            },
            err => {
              console.error(nextRequest.url, err);
              this.retry(nextRequest);
            },
            () => { }
          );
        } else {
          this.stopQueue();
        }
      },
      err => console.error(err)
    );
  }

  private static stopQueue() {
    if (this.queueSubscription) {
      this.queueSubscription.unsubscribe();
      this.queueSubscription = undefined;
    }
  }

  public static retry(request: QueuedRequest) {
    request.retryCount -= 1;
    this.queue.push(request);
  }

  public static queueRequest(url: string): Observable<any> {
    return Observable.create(observer => {
      if (!this.queueSubscription) {
        this.moveQueue();
      }
      this.queue.push(new QueuedRequest(url, observer, 3));
    });
  }

  public static getPlayerProfile(account_id: number): Observable<PlayerProfileJson> {
    return this.queueRequest(format('https://api.opendota.com/api/players/%s/', account_id));
  };

  public static getRecentMatches(account_id: number): Observable<RecentMatchJson[]> {
    return this.queueRequest(format('https://api.opendota.com/api/players/%s/recentMatches', account_id));
  }

  public static getFullMatches(matcheIds: number[]): Observable<MatchJson[]> {
    const formatedUrls = matcheIds.map(match_id => format('https://api.opendota.com/api/matches/%s', match_id));
    return Observable.forkJoin(formatedUrls.map(url => this.queueRequest(url)));
  };

  public static getMatch(match_id: number): Observable<MatchJson> {
    return this.queueRequest(format('https://api.opendota.com/api/matches/%s', match_id));
  }
}

