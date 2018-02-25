import { Observable, Subscription, Observer } from 'rxjs';
// import PlayerScore from '../model/PlayerScore';
import DataStore from './DataStore';
import { MatchJson, RecentMatchJson } from '../dota-api/DotaJsonTypings';
import StorageConvertionUtil from '../utils/StorageConvertionUtil';
import Pair from '../model/Pair';
import DotaApi from '../dota-api/DotaApi';
import Nominations from '../model/Nominations';
import { DotaParser } from './DotaParser';
import ScoreBoard from '../model/ScoreBoard';

export default class NominationService {
  private subscription: Subscription;
  private recentGamesObserver: Observer<number>;

  constructor(private dotaApi: DotaApi = new DotaApi(), private dataStore: DataStore = new DataStore()) { }

  public nominate(pairs: Pair<number, number[]>[]): Observable<ScoreBoard> {
    return Observable.create(observer => {
      Observable.forkJoin(pairs.map(p => this.dataStore.getMatches(p.val).map(fullMatches => new Pair(p.key, fullMatches)))).subscribe(fmps => {
        const playersScores = fmps.map(fmp => {
          let playerScore = new Pair(fmp.key, Nominations.all);
          fmp.val.forEach(match => {
            playerScore.val.forEach(nomination => {
              nomination.scoreMatch(match, DotaParser.getPlayerSlot(match, fmp.key));
            });
          });
          return playerScore;
        });
        const scoreBoard = new ScoreBoard();
        playersScores.forEach(ps => scoreBoard.applyPlayerScores(ps));
        observer.next(scoreBoard);
        observer.complete();
      });
    });
  }
}