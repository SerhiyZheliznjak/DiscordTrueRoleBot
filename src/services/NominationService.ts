import { Observable, Subscription, Observer } from 'rxjs';
// import PlayerScore from '../model/PlayerScore';
import DataStore from './DataStore';
import MyUtils from '../utils/MyUtils';
import { MatchJson, RecentMatchJson } from '../dota-api/DotaJsonTypings';
import StorageConvertionUtil from '../utils/StorageConvertionUtil';
import Pair from '../model/Pair';
import DotaApi from '../dota-api/DotaApi';

export default class NominationService {
  private subscription: Subscription;
  private recentGamesObserver: Observer<number>;

  constructor(private dotaApi: DotaApi = new DotaApi(), private dataStore: DataStore = new DataStore()) { }



  // public observeRecentMatches(accountIds: number[]): Observable<Pair<number, boolean>> {
  //   return Observable.create((playersObserver: Observer<Pair<number, number[]>[]>) => {
  //     this.recentGamesObserver = {
  //       next: () => {
  //         Observable.forkJoin(accountIds.map(account_id =>
  //           this.dotaApi.getRecentMatches(account_id).map(recentMatches => new Pair(account_id, (recentMatches as RecentMatchJson[]).map(m => m.match_id)))))
  //           .subscribe(pair => playersObserver.next(pair));
  //         accountIds.forEach(account_id => {
  //           .subscribe(recentMatches => {

  //             playersObserver.next(new Pair(account_id, !!newMatches.length));
  //             this.dataStore.updatePlayerRecentMatches(account_id, recentMatches);
  //           });
  //         });
  //       },
  //       error: () => { },
  //       complete: () => { }
  //     }
  //   });
  // }

  public nominate(pairs: Pair<number, number[]>[]) {
    Observable.forkJoin(pairs.map(p => this.dataStore.getMatches(p.val).map(fullMatches => new Pair(p.key, fullMatches))).subscribe
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








