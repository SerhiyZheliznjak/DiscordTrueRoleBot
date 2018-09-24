import PlayerRecentMatches from "../model/PlayerRecentMatches";
import PlayerFullMatches from "../model/PlayerFullMatches";
import Constants from "../Constants";
import NominationResult from "../model/NominationResult";
import NominationResultJson from "../model/json/NominationResultJson";

export default class NominationUtils {
    public hasNewMatches(freshMatches: PlayerRecentMatches, storedMatches: PlayerRecentMatches): boolean {
        if (this.noMatches(storedMatches)) {
            return !this.noMatches(freshMatches);
        } else {
            if (!this.noMatches(freshMatches)) {
                return freshMatches.recentMatchesIds[0] === storedMatches.recentMatchesIds[0] ? false : true;
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
