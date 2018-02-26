import { Observable, Subscription, Observer } from 'rxjs';
import DataStore from './DataStore';
import { MatchJson, RecentMatchJson } from '../dota-api/DotaJsonTypings';
import StorageConvertionUtil from '../utils/StorageConvertionUtil';
import Pair from '../model/Pair';
// import DotaApi from '../dota-api/DotaApi';
import Nominations from '../model/Nominations';
import { DotaParser } from './DotaParser';
import ScoreBoard from '../model/ScoreBoard';
import { Nomination } from '../model/Nomination';

export default class NominationService {
  private subscription: Subscription;
  private recentGamesObserver: Observer<number>;

  constructor(
    // private dotaApi: DotaApi = new DotaApi(),
    private dataStore: DataStore = new DataStore()
  ) { }

  public nominate(playerRecentMatches: Array<Pair<number, number[]>>): Observable<ScoreBoard> {
    const scoreBoard = new ScoreBoard();
    return Observable.create(scoreBoardObserver => {
      this.getPlayerFullMatches(playerRecentMatches)
        .subscribe(playerFullMatches => {
          console.log('--------got all matches for all players-----------', playerFullMatches.length);
          playerFullMatches.forEach(ps => scoreBoard.scorePlayer(ps.key, ps.val));
          scoreBoardObserver.next(scoreBoard);
          scoreBoardObserver.complete();
        });
    });
  }

  private getPlayerFullMatches(playerRecentMatches: Array<Pair<number, number[]>>): Observable<Array<Pair<number, MatchJson[]>>> {
    console.log(' getting matches for each player ');
    return Observable.forkJoin(
      playerRecentMatches.map(p => this.dataStore.getMatches(p.val).map(fullMatches => {
        console.log(' got matches for ', p.key);
        return new Pair(p.key, fullMatches);
      }))
    );
  }
}
