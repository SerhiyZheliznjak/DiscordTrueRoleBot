import { Observable, Subscription, Observer } from 'rxjs';
import DataStore from './DataStore';
import Nominations from '../model/Nominations';
import ScoreBoard from '../model/ScoreBoard';
import DotaApi from '../dota-api/DotaApi';
import NominationResult from '../model/NominationResult';
import Constants from '../Constants';
import PlayerRecentMatches from '../model/PlayerRecentMatches';
import PlayerFullMatches from '../model/PlayerFullMatches';
import NominationUtils from '../utils/NominationUtils';
import NominationResultJson from '../model/json/NominationResultJson';

export default class NominationService {
  private subscription: Subscription;
  private recentGamesObserver: Observer<number>;
  private claimedNominationsObserver: Observer<NominationResult[]>;
  private dotaIds: number[];
  private scoreBoard: ScoreBoard;

  constructor(
    private dataStore: DataStore = new DataStore(),
    private dotaApi: DotaApi = new DotaApi(),
    private nominationUtils = new NominationUtils()
  ) {
    this.recentGamesObserver = {
      next: () => this.nextCheck(this.dotaIds),
      error: () => { },
      complete: () => { }
    };
  }

  public startNominating(playersMap: Map<number, string>): Observable<NominationResult[]> {
    DataStore.matchesCacheSize = playersMap.size * 20;
    this.dotaIds = this.getDotaIds(playersMap);
    this.subscription = Observable.interval(Constants.WATCH_INTERVAL).subscribe(this.recentGamesObserver);
    this.recentGamesObserver.next(0);
    return Observable.create(claimedNominationsObserver => this.claimedNominationsObserver = claimedNominationsObserver);
  }

  public getTopN(nominationClassName: string, n: number = 3): Observable<NominationResult[]> {
    const nomination = Nominations.getByClassName(nominationClassName);
    if (!nomination) {
      console.log('no such nomination className: ', nominationClassName);
      return;
    }
    const nominationKey = nomination.getKey();
    if (this.scoreBoard && this.scoreBoard.hasScores(nominationKey)) {
      console.log('using scored scoreboard');
      return Observable.of(this.scoreBoard.getTopN(n).get(nominationKey));
    } else {
      console.log('getting new scoreboard');
      return Observable.from(this.dotaIds)
        .flatMap((account_id: number) => this.getRecentMatchesForPlayer(account_id))
        .flatMap((playerWithNewMatches: PlayerRecentMatches) => this.mapToPlayerWithFullMatches(playerWithNewMatches))
        .reduce((arr: PlayerFullMatches[], pfm: PlayerFullMatches) => [...arr, pfm], []).map(playersMatches => {
          this.scoreBoard = new ScoreBoard();
          playersMatches.forEach(pfm => this.scoreBoard.scorePlayer(pfm.account_id, pfm.matches));
          return this.scoreBoard.getTopN(n).get(nominationKey);
        });
    }
  }

  public stopNominating(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    console.log('stopped nominating');
  }

  public mapRecentMatchesToNew(recentMatches: PlayerRecentMatches, storedMatches: PlayerRecentMatches): PlayerRecentMatches {
    const newMatches = this.nominationUtils.getNewMatches(recentMatches, storedMatches);
    if (newMatches.recentMatchesIds.length) {
      this.dataStore.updatePlayerRecentMatch(newMatches.account_id, newMatches.recentMatchesIds);
    }
    return newMatches;
  }

  public mapToPlayerWithFullMatches(prm: PlayerRecentMatches): Observable<PlayerFullMatches> {
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

  public getRecentMatchesForPlayer(account_id: number): Observable<PlayerRecentMatches> {
    return this.dotaApi.getRecentMatches(account_id).map(recentMatches => {
      return new PlayerRecentMatches(account_id, recentMatches.map(m => m.match_id));
    });
  }

  public getNewResults(playersMatches: PlayerFullMatches[], hallOfFame: Map<number, NominationResultJson>): NominationResult[] {
    this.scoreBoard = new ScoreBoard();
    playersMatches.forEach(pfm => this.scoreBoard.scorePlayer(pfm.account_id, pfm.matches));
    return this.nominationUtils.getNewRecords(hallOfFame, this.scoreBoard.getFirstPlaces());
  }

  public awardWinners(newNominationsClaimed: NominationResult[]): void {
    for (const nominationResult of newNominationsClaimed) {
      this.dataStore.updateNominationResult(nominationResult);
    }
    this.claimedNominationsObserver.next(newNominationsClaimed);
  }

  public nextCheck(dotaIds: number[]): void {
    console.log(new Date().toString().split(' GMT')[0], ': Checking...');
    this.getPlayerFullMatches(dotaIds)
      .subscribe((playersMatches: PlayerFullMatches[]) => {
        this.dataStore.hallOfFame.subscribe(hallOfFame => {
          const newNominationsClaimed = this.getNewResults(playersMatches, hallOfFame);
          if (!!newNominationsClaimed.length) {
            this.awardWinners(newNominationsClaimed);
          }
        });
      });
  }

  private getPlayerFullMatches(dotaIds: number[]): Observable<PlayerFullMatches[]> {
    return Observable.from(dotaIds)
      .flatMap((account_id: number) =>
        Observable.zip(this.getRecentMatchesForPlayer(account_id), this.dataStore.getRecentMatchesForPlayer(account_id)))
      .map((playerMatches: PlayerRecentMatches[]) => this.mapRecentMatchesToNew(playerMatches[0], playerMatches[1]))
      .flatMap((playerWithNewMatches: PlayerRecentMatches) => this.mapToPlayerWithFullMatches(playerWithNewMatches))
      .reduce((arr: PlayerFullMatches[], pfm: PlayerFullMatches) => [...arr, pfm], []);
  }

  private getDotaIds(playersMap: Map<number, string>): number[] {
    const dotaIds = [];
    for (const id of playersMap.keys()) {
      dotaIds.push(id);
    }
    return dotaIds;
  }
}
