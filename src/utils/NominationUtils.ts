import PlayerRecentMatches from "../model/PlayerRecentMatches";
import PlayerFullMatches from "../model/PlayerFullMatches";
import { Observable } from "rxjs";
import { RecentMatchJson } from "../dota-api/DotaJsonTypings";
import Constants from "../Constants";
import NominationResult from "../model/NominationResult";
import NominationResultJson from "../model/json/NominationResultJson";

export default class NominationUtils {
    public isFreshMatch(recentMatch: RecentMatchJson): boolean {
        const nowInSeconds = new Date().getTime() / 1000;
        return nowInSeconds - recentMatch.start_time < Constants.MATCH_DUE_TIME_SEC;
    }

    public hasNewMatches(freshMatches: PlayerRecentMatches, storedMatches: PlayerRecentMatches): boolean {
        if (this.noMatches(storedMatches)) {
            return !this.noMatches(freshMatches);
        } else {
            if (!this.noMatches(freshMatches)) {
                return this.freshMatchesNotStored(freshMatches, storedMatches);
            }
        }
        return false;
    }

    public getNewMatches(recentMatches: PlayerRecentMatches, storedMatches: PlayerRecentMatches): PlayerRecentMatches {
        if (this.hasNewMatches(recentMatches, storedMatches)) {
            return recentMatches;
        }
        return new PlayerRecentMatches(recentMatches.account_id, []);
    }

    public isClaimedNomination(newWinner: NominationResult, storedWinner: NominationResultJson): boolean {
        return this.noStoredWinner(storedWinner)
            || this.isOutOfDueDate(storedWinner)
            || newWinner.nomination.getScore() > storedWinner.score;
    }

    public getNewRecords(hallOfFame: Map<number, NominationResultJson>, newResults: Map<number, NominationResult>): NominationResult[] {
        const newNominationsClaimed: NominationResult[] = [];
        for (const nominationName of newResults.keys()) {
            const newWinner = newResults.get(nominationName);
            if (newWinner.account_id !== Constants.UNCLAIMED && newWinner.nomination.isScored()) {
                if (this.isClaimedNomination(newWinner, hallOfFame.get(nominationName))) {
                    newNominationsClaimed.push(newWinner);
                }
            }
        }
        return newNominationsClaimed;
    }

    public getPlayerFullMatches(pfm: PlayerFullMatches, match): PlayerFullMatches {
        if (match) {
            pfm.matches.push(match);
        }
        return pfm;
    }

    private freshMatchesNotStored(freshMatches: PlayerRecentMatches, storedMatches: PlayerRecentMatches): boolean {
        const notStored = freshMatches.recentMatchesIds.filter(match_id => storedMatches.recentMatchesIds.indexOf(match_id) < 0);
        return notStored.length > 0;
    }

    private noMatches(playerMatches: PlayerRecentMatches): boolean {
        return !playerMatches || !playerMatches.recentMatchesIds || !playerMatches.recentMatchesIds.length;
    }

    private noStoredWinner(storedWinner: NominationResultJson): boolean {
        return !storedWinner;
    }

    private isOutOfDueDate(storedWinner: NominationResultJson) {
        return new Date().getTime() - storedWinner.timeClaimed >= Constants.NOMINATION_DUE_INTERVAL;
    }
}
