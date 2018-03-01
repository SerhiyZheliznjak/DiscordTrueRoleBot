import { RxHttpRequest } from 'rx-http-request';
import { Observable, Subscription, Observer } from 'rxjs';
import { format } from 'util';
import { RecentMatchJson, PlayerProfileJson, MatchJson } from './DotaJsonTypings';

class QueuedRequest {
  constructor(public url: string, public observers: Array<Observer<any>>, public retryCount: number, public observable: Observable<any>) { }
}

export default class DotaApi {
  public static queue: QueuedRequest[] = [];
  public static queueSubscription: Subscription;

  public static getMatchUrl(match_id: number): string {
    return format('https://api.opendota.com/api/matches/%s', match_id);
  }

  public static getRecentMatchesUrl(account_id: number): string {
    return format('https://api.opendota.com/api/players/%s/recentMatches', account_id);
  }

  constructor(private rxHttpRequest: RxHttpRequest = RxHttpRequest) { }

  public queueRequest(url: string): Observable<any> {
    let observable;
    const queued = this.isQueued(url);
    if (queued === undefined) {
      observable = Observable.create((observer: Observer<any>) => {
        const isQueued = this.isQueued(url);
        if (!isQueued) {
          DotaApi.queue.push(new QueuedRequest(url, [observer], 3, observable));
        } else {
          isQueued.observers.push(observer);
        }
        if (!DotaApi.queueSubscription) {
          this.moveQueue();
        }
      });
    } else {
      observable = queued.observable;
    }

    return observable;
  }

  public isQueued(url: string) {
    return DotaApi.queue.find(q => q.url === url);
  }

  public getPlayerProfile(account_id: number): Observable<PlayerProfileJson> {
    return this.queueRequest(format('https://api.opendota.com/api/players/%s/', account_id));
  }

  public getRecentMatches(account_id: number): Observable<RecentMatchJson[]> {
    return this.queueRequest(DotaApi.getRecentMatchesUrl(account_id));
  }

  public getMatch(match_id: number): Observable<MatchJson> {
    return this.queueRequest(DotaApi.getMatchUrl(match_id));
  }

  private moveQueue() {
    DotaApi.queueSubscription = Observable.interval(400).subscribe(
      () => {
        if (DotaApi.queue.length > 0) {
          const nextRequest = DotaApi.queue.shift();
          if (nextRequest.retryCount === 0) {
            nextRequest.observers.forEach(obs => obs.error('Failed to fetch from ' + nextRequest.url));
          }
          console.log('requesting ', nextRequest.url);
          this.rxHttpRequest.get(nextRequest.url).subscribe(
            (data: any) => {
              let obj;
              try {
                obj = JSON.parse(data.body);
              } catch (err) {
                console.error(err, nextRequest.url, '. response data: ', data.body);
                this.retry(nextRequest);
              }
              if (obj) {
                nextRequest.observers.forEach(obs => {
                  obs.next(obj);
                  obs.complete();
                });
              }
            },
            err => {
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

  private stopQueue() {
    if (DotaApi.queueSubscription) {
      DotaApi.queueSubscription.unsubscribe();
      DotaApi.queueSubscription = undefined;
    }
  }

  private retry(request: QueuedRequest) {
    request.retryCount -= 1;
    console.log('retrying ', request.url);
    DotaApi.queue.push(request);
  }
}
