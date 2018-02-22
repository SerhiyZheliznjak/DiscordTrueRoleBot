import { Observable, Subscription, Observer } from 'rxjs';
// import PlayerScore from '../model/PlayerScore';
import DataStore from './DataStore';
import MyUtils from '../utils/MyUtils';
import RecentMatchJson from '../dota-api/DotaJsonTypings';
// import DotaApi from '../dota-api/DotaApi';
import StorageConvertionUtil from '../utils/StorageConvertionUtil';
import Pair from '../model/Pair';
import DotaApi from '../dota-api/DotaApi';

export default class NominationService {
  private static subscription: Subscription;
  private static recentGamesObserver: Observer<number>;

  public static start(): void {
    this.subscription = Observable.interval(1000 * 60 * 60).subscribe(this.recentGamesObserver);
  }

  public static stop(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
    console.log('stopped watching');
  }

  public static observeNewMatches(accountIds: number[]): Observable<Pair<number, boolean>> {
    return Observable.create((playersObserver: Observer<Pair<number, boolean>>) => {
      this.recentGamesObserver = {
        next: () => {
          // accountIds.forEach(account_id => {
          //   DotaApi.getRecentMatches(account_id).subscribe(recentMatches => {
          //     const newMatches = recentMatches.filter(rm => DataStore.playerRecentMatchesCache.get(account_id).indexOf(rm.match_id) < 0)
          //     playersObserver.next(new Pair(account_id, !!newMatches.length));
          //     DataStore.updatePlayerRecentMatches(account_id, recentMatches);
          //   });
          // });
        },
        error: () => { },
        complete: () => { }
      }
      this.start();
      recentGamesObserver.next();
    });
  }

  public static nominate(account_id: number) {
    // const playerRecentMatches = StorageConvertionUtil.convertToRecentMatchJson(DataStore.playerRecentMatchesCache);
    // MyUtils.subscriptionChain(playerRecentMatches.map(prm => DataStore.getMatch(prm.)));
  }



  // private static getPlayerScoreForRecentMatches(account_id, nominatedScores): Observable<any> {
  //   return Observable.create(observer => {
  //     let playerScore = nominatedScores.find(p => p.getAccountId() === account_id);
  //     // playerScore = !!playerScore ? playerScore : new PlayerScore(account_id);
  //     DotaApi.getRecentMatches(account_id).subscribe(recentMatches => {
  //       const recentMatchesIds = recentMatches.map(m => m.match_id);
  //       const unnominatedMatchesIds = playerScore.getUnnominatedMatches(recentMatchesIds);
  //       subscriptionChain(unnominatedMatchesIds.map(match_id => DataStore.getMatch(match_id)));

  //       function subscriptionChain(observables) {
  //         const nextObservable = observables.shift();
  //         if (nextObservable) {
  //           nextObservable.subscribe(fullMatch => {
  //             playerScore.getNominations().forEach(
  //               nomination => nomination.scoreMatch(fullMatch, recentMatches.find(rm => rm.match_id === fullMatch.match_id).player_slot)
  //             );
  //             subscriptionChain(observables);
  //           });
  //         } else {
  //           playerScore.recentMatchesIds = recentMatchesIds;
  //           console.log('Finished scoring player ', account_id);
  //           observer.next(playerScore);
  //           observer.complete();
  //         }
  //       }
  //     });
  //   });
  // }
}

let nominatedScores;
let subscription;
let recentGamesObserver;

// function getNominationsForPlayer(matches, player_slot) {
//   // const nominationsList = NominationsList.create();
//   matches.forEach(match => nominationsList.forEach(nomination => nomination.scoreMatch(match, player_slot)));
//   return nominationsList;
// }








