import { Observable, Subscription, Observer } from 'rxjs';
import DataStore from './DataStore';
import { MatchJson, RecentMatchJson } from '../dota-api/DotaJsonTypings';
import Pair from '../model/Pair';
import Nominations from '../model/Nominations';
import ScoreBoard from '../model/ScoreBoard';
import { Nomination } from '../model/Nomination';
import DotaApi from '../dota-api/DotaApi';
import NominationWinner from '../model/NominationWinner';
import { Constants } from '../Constants';

export default class NominationService {
  private subscription: Subscription;
  private recentGamesObserver: Observer<number>;
  private claimedNominationsObserver: Observer<NominationWinner[]>;
  private dotaIds: number[];

  constructor(
    private dataStore: DataStore = new DataStore(),
    private dotaApi: DotaApi = new DotaApi()
  ) {
    this.recentGamesObserver = {
      next: () => this.recentGamesObserverNext(),
      error: () => { },
      complete: () => { }
    };
  }

  public startWatching(playersMap: Map<number, string>) {
    DataStore.maxMatches = playersMap.size * 20;
    this.dotaIds = this.getDotaIds(playersMap);
    this.subscription = Observable.interval(Constants.WATCH_INTERVAL).subscribe(this.recentGamesObserver);
    this.recentGamesObserver.next(0);
    return Observable.create(claimedNominationsObserver => this.claimedNominationsObserver = claimedNominationsObserver);
  }

  public stopWatching(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    console.log('stopped watching');
  }

  private nominate(playerRecentMatches: Array<Pair<number, number[]>>): Observable<ScoreBoard> {
    const scoreBoard = new ScoreBoard();
    return Observable.create(scoreBoardObserver => {
      this.getPlayerFullMatches(playerRecentMatches)
        .subscribe(playerFullMatches => {
          playerFullMatches.forEach(ps => scoreBoard.scorePlayer(ps.key, ps.val));
          scoreBoardObserver.next(scoreBoard);
          scoreBoardObserver.complete();
        });
    });
  }

  private getPlayerFullMatches(playerRecentMatches: Array<Pair<number, number[]>>): Observable<Array<Pair<number, MatchJson[]>>> {
    return Observable.forkJoin(
      playerRecentMatches.map(p => this.dataStore.getMatches(p.val).map(fullMatches => {
        return new Pair(p.key, fullMatches);
      }))
    );
  }

  private getDotaIds(playersMap: Map<number, string>): number[] {
    const dotaIds = [];
    for (const id of playersMap.keys()) {
      dotaIds.push(id);
    }
    return dotaIds;
  }

  private recentGamesObserverNext() {
    Observable.forkJoin(
      this.dotaIds.map(account_id =>
        this.dotaApi.getRecentMatches(account_id)
          .map(recentMatch => new Pair(account_id, (recentMatch as RecentMatchJson[])
            .filter(rm => this.isMatchYoungerThanWeek(rm))
            .map(m => m.match_id))))
    ).subscribe(playerRecentMatches => {
      if (this.hasNewMatches(playerRecentMatches)) {
        this.nominate(playerRecentMatches).subscribe(scoreBoard => {
          this.awardWinners(scoreBoard);
        });
        playerRecentMatches.forEach(p => this.dataStore.updatePlayerRecentMatches(p.key, p.val));
        this.dataStore.saveRecentMatches();
      }
    });
  }

  private isMatchYoungerThanWeek(recentMatch: RecentMatchJson): boolean {
    return (recentMatch.start_time - (new Date().getTime() / 1000)) < Constants.MATCH_DUE_TIME_SEC;
  }

  private hasNewMatches(playerRecentMatches: Array<Pair<number, number[]>>): boolean {
    const atLeastOneNewMatch = playerRecentMatches.find(pair => {
      const newMatches = pair.val.filter(match_id => {
        const prm = this.dataStore.playerRecentMatchesCache.get(pair.key);
        return prm ? prm.indexOf(match_id) < 0 : true;
      });
      return newMatches.length > 0;
    });
    return !!atLeastOneNewMatch;
  }

  private awardWinners(scoreBoard: ScoreBoard): void {
    const newNomintionsClaimed: NominationWinner[] = [];
    for (const nominationName of scoreBoard.nominationsWinners.keys()) {
      const newWinner = scoreBoard.nominationsWinners.get(nominationName);
      if (newWinner.account_id !== Constants.UNCLAIMED && newWinner.nomination.isScored()) {
        const storedWinner = this.dataStore.wonNominationCache.get(nominationName);
        if (this.isClaimedNomination(newWinner, storedWinner)) {
          newNomintionsClaimed.push(newWinner);
        }
      }
    }

    if (!!newNomintionsClaimed.length) {
      console.log('awarding winners ', newNomintionsClaimed.length);
      this.dataStore.saveWinnersScore(scoreBoard.nominationsWinners);
      this.claimedNominationsObserver.next(newNomintionsClaimed);
    }
  }

  private isClaimedNomination(newWinner: NominationWinner, storedWinner: NominationWinner): boolean {
    return !storedWinner
      || newWinner.nomination.hasHigherScoreThen(storedWinner.nomination);
      // || this.isOutOfDueDate(newWinner, storedWinner);
  }

  private isOutOfDueDate(newWinner: NominationWinner, storedWinner: NominationWinner) {
    return newWinner.nomination.timeClaimed - storedWinner.nomination.timeClaimed >= Constants.NOMINATION_DUE_INTERVAL
      && newWinner.account_id !== storedWinner.account_id
      && newWinner.nomination.getScore() !== storedWinner.nomination.getScore();
  }
}
