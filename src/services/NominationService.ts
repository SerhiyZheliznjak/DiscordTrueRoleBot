import { Observable, Subscription, Observer } from 'rxjs';
import DataStore from './DataStore';
import { MatchJson, RecentMatchJson } from '../dota-api/DotaJsonTypings';
import Pair from '../model/Pair';
import Nominations from '../model/Nominations';
import ScoreBoard from '../model/ScoreBoard';
import Nomination from '../model/Nomination';
import DotaApi from '../dota-api/DotaApi';
import NominationResult from '../model/NominationResult';
import Constants from '../Constants';
import PlayerRecentMatches from '../model/PlayerRecentMatches';
import PlayerFullMatches from '../model/PlayerFullMatches';

export default class NominationService {
  private subscription: Subscription;
  private recentGamesObserver: Observer<number>;
  private claimedNominationsObserver: Observer<NominationResult[]>;
  private dotaIds: number[];

  constructor(
    private dataStore: DataStore = new DataStore(),
    private dotaApi: DotaApi = new DotaApi()
  ) {
    console.log('Initialized NominationService');
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
      const freshMatches = recentMatches.filter(rm => this.isFreshMatch(rm)).map(m => m.match_id);
      return new PlayerRecentMatches(account_id, freshMatches);
    });
  }

  private nextCheck() {
    const scoreBoard = new ScoreBoard();
    Observable.from(this.dotaIds)
      .flatMap((account_id: number) =>
        Observable.zip(this.getFreshRecentMatchesForPlayer(account_id), this.dataStore.getRecentMatchesForPlayer(account_id)))
      .map((playerMatches: PlayerRecentMatches[]) => this.getOnlyFreshNewMatches(playerMatches))
      .flatMap(playersWithNewMatches => this.mapToPlayerWithFullMatches(playersWithNewMatches))
      .reduce((arr: PlayerFullMatches[], pfm: PlayerFullMatches) => [...arr, pfm], [])
      .subscribe((playersMatches: PlayerFullMatches[]) => {
        playersMatches.forEach(pfm => scoreBoard.scorePlayer(pfm.account_id, pfm.matches));
        this.awardWinners(scoreBoard);
      });
  }

  private mapToPlayerWithFullMatches(prm: PlayerRecentMatches): Observable<PlayerFullMatches> {
    if (!prm.recentMatchesIds.length) {
      return Observable.of(new PlayerFullMatches(prm.account_id, []));
    }
    return Observable.from(prm.recentMatchesIds)
      .flatMap(match_id => this.dataStore.getMatch(match_id))
      .scan((pfm: PlayerFullMatches, match) => {
        if (match) {
          console.log('Scanend ', match.match_id, 'match for ', prm.account_id, ' curernt length ', pfm.matches.length);
          pfm.matches.push(match);
        }
        return pfm;
      }, new PlayerFullMatches(prm.account_id, []));
  }

  private isFreshMatch(recentMatch: RecentMatchJson): boolean {
    const nowInSeconds = new Date().getTime() / 1000;
    return nowInSeconds - recentMatch.start_time < Constants.MATCH_DUE_TIME_SEC;
  }

  private hasNewMatches(freshMatches?: PlayerRecentMatches, storedMatches?: PlayerRecentMatches): boolean {
    let hasNewMatch = false;
    console.log('Player ', freshMatches.account_id);
    if (this.noMatches(storedMatches)) {
      hasNewMatch = !this.noMatches(freshMatches);
    } else {
      if (!this.noMatches(freshMatches)) {
        hasNewMatch = this.storedMatchesDoNotContainRecent(freshMatches, storedMatches);
      }
    }
    console.log('has new matches: ', hasNewMatch);
    return hasNewMatch;
  }

  private noMatches(playerMatches: PlayerRecentMatches): boolean {
    return !playerMatches || !playerMatches.recentMatchesIds || !playerMatches.recentMatchesIds.length;
  }

  private storedMatchesDoNotContainRecent(freshMatches: PlayerRecentMatches, storedMatches: PlayerRecentMatches) {
    return storedMatches.recentMatchesIds
      .reduce((exist, match_id) => exist || freshMatches.recentMatchesIds.indexOf(match_id) < 0, false);
  }

  private getOnlyFreshNewMatches(playerMatches: PlayerRecentMatches[]): PlayerRecentMatches {
    if (this.hasNewMatches(...playerMatches)) {
      this.dataStore.updatePlayerRecentMatch(playerMatches[0].account_id, playerMatches[0].recentMatchesIds);
      return playerMatches[0];
    }
    return new PlayerRecentMatches(playerMatches[0].account_id, []);
  }

  private awardWinners(scoreBoard: ScoreBoard): void {
    this.dataStore.nominationsResults.subscribe(wonNominations => {
      const newNomintionsClaimed: NominationResult[] = [];
      for (const nominationName of scoreBoard.nominationsResults.keys()) {
        const newWinner = scoreBoard.nominationsResults.get(nominationName);
        if (newWinner.account_id !== Constants.UNCLAIMED && newWinner.nomination.isScored()) {
          const storedWinner = wonNominations.get(nominationName);
          if (this.isClaimedNomination(newWinner, storedWinner)) {
            newNomintionsClaimed.push(newWinner);
          }
        }
      }
      if (!!newNomintionsClaimed.length) {
        for (const nominationResult of scoreBoard.nominationsResults.values()) {
          this.dataStore.updateNominationResult(nominationResult);
        }
        this.claimedNominationsObserver.next(newNomintionsClaimed);
      }
    });
  }

  private isClaimedNomination(newWinner: NominationResult, storedWinner: NominationResult): boolean {
    return !storedWinner
      || newWinner.nomination.hasHigherScoreThen(storedWinner.nomination)
      || this.isOutOfDueDate(newWinner, storedWinner);
  }

  private isOutOfDueDate(newWinner: NominationResult, storedWinner: NominationResult) {
    return newWinner.nomination.timeClaimed - storedWinner.nomination.timeClaimed >= Constants.NOMINATION_DUE_INTERVAL
      && newWinner.account_id !== storedWinner.account_id
      && newWinner.nomination.getScore() !== storedWinner.nomination.getScore();
  }
}
