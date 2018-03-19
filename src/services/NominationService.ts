import { Observable, Subscription, Observer } from 'rxjs';
import DataStore from './DataStore';
import Nominations from '../model/Nominations';
import ScoreBoard from '../model/ScoreBoard';
import Nomination from '../model/Nomination';
import DotaApi from '../dota-api/DotaApi';
import NominationResult from '../model/NominationResult';
import Constants from '../Constants';
import PlayerRecentMatches from '../model/PlayerRecentMatches';
import PlayerFullMatches from '../model/PlayerFullMatches';
import NominationUtils from '../utils/NominationUtils';

export default class NominationService {
  private subscription: Subscription;
  private recentGamesObserver: Observer<number>;
  private claimedNominationsObserver: Observer<NominationResult[]>;
  private dotaIds: number[];

  constructor(
    private dataStore: DataStore = new DataStore(),
    private dotaApi: DotaApi = new DotaApi(),
    private nominationUtils = new NominationUtils()
  ) {
    this.recentGamesObserver = {
      next: () => this.nextCheck(),
      error: () => { },
      complete: () => { }
    };
  }

  public startNominating(playersMap: Map<number, string>): Observable<NominationResult[]> {
    DataStore.maxMatches = playersMap.size * 20;
    this.dotaIds = this.getDotaIds(playersMap);
    this.subscription = Observable.interval(Constants.WATCH_INTERVAL).subscribe(this.recentGamesObserver);
    this.recentGamesObserver.next(0);
    return Observable.create(claimedNominationsObserver => this.claimedNominationsObserver = claimedNominationsObserver);
  }

  public stopNominating(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    console.log('stopped nominating');
  }

  private getDotaIds(playersMap: Map<number, string>): number[] {
    const dotaIds = [];
    for (const id of playersMap.keys()) {
      dotaIds.push(id);
    }
    return dotaIds;
  }

  private getFreshRecentMatchesForPlayer(account_id: number): Observable<PlayerRecentMatches> {
    return this.dotaApi.getRecentMatches(account_id).map(recentMatches => {
      const freshMatches = recentMatches.filter(rm => this.nominationUtils.isFreshMatch(rm)).map(m => m.match_id);
      return new PlayerRecentMatches(account_id, freshMatches);
    });
  }

  private nextCheck(): void {
    Observable.from(this.dotaIds)
      .flatMap((account_id: number) =>
        Observable.zip(this.getFreshRecentMatchesForPlayer(account_id), this.dataStore.getRecentMatchesForPlayer(account_id)))
      .map((playerMatches: PlayerRecentMatches[]) => {
        const newMatches = this.nominationUtils.getNewMatches(playerMatches[0], playerMatches[1]);
        this.dataStore.updatePlayerRecentMatch(newMatches.account_id, newMatches.recentMatchesIds);
        return newMatches;
      })
      .flatMap(playerWithNewMatches => this.mapToPlayerWithFullMatches(playerWithNewMatches))
      .reduce((arr: PlayerFullMatches[], pfm: PlayerFullMatches) => [...arr, pfm], [])
      .subscribe((playersMatches: PlayerFullMatches[]) => this.countResults(playersMatches));
  }

  private mapToPlayerWithFullMatches(prm: PlayerRecentMatches): Observable<PlayerFullMatches> {
    if (!prm.recentMatchesIds.length) {
      return Observable.of(new PlayerFullMatches(prm.account_id, []));
    }
    return Observable.from(prm.recentMatchesIds)
      .flatMap(match_id => this.dataStore.getMatch(match_id))
      .reduce(
        (pfm: PlayerFullMatches, match) => this.nominationUtils.getPlayerFullMatches(pfm, match),
        new PlayerFullMatches(prm.account_id, [])
      );
  }

  private countResults(playersMatches: PlayerFullMatches[]): void {
    this.dataStore.hallOfFame.subscribe(hallOfFame => {
      const scoreBoard = new ScoreBoard();
      playersMatches.forEach(pfm => scoreBoard.scorePlayer(pfm.account_id, pfm.matches));
      const newNominationsClaimed = this.nominationUtils.getNewRecords(hallOfFame, scoreBoard.nominationsResults);
      if (!!newNominationsClaimed.length) {
        this.awardWinners(newNominationsClaimed);
      }
    });
  }

  private awardWinners(newNominationsClaimed: NominationResult[]): void {
    for (const nominationResult of newNominationsClaimed) {
      this.dataStore.updateNominationResult(nominationResult);
    }
    this.claimedNominationsObserver.next(newNominationsClaimed);
  }
}
