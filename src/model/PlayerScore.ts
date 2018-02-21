import Nominations from "./Nominations";
import { Nomination } from "./Nomination";
import { NominationJson } from "./NominationJson";

export default class PlayerScore {
    public nominations: Nomination[];
    public playedNewMatches: boolean;

    constructor(private _account_id, private recentMatchesIds) {
        this.nominations = Nominations.all;
        this.recentMatchesIds = !!recentMatchesIds ? recentMatchesIds : [];
    }
    public get account_id(): string {
        return this._account_id;
    }
    public getUnnominatedMatches(recentMatchesIds): string[] {
        const unnominatedMatches = recentMatchesIds.filter(rm_id => !this.recentMatchesIds.find(nrm_id => rm_id === nrm_id));
        this.playedNewMatches = !!unnominatedMatches.length;
        return unnominatedMatches;
    }
    public setPointsFromJsonObject(jsonNominations: NominationJson[]): void {
        this.nominations.forEach(nomination => {
            const jsonN = jsonNominations.find(n => n.name === nomination.getName());
            if (!!jsonN) {
                jsonN.points.forEach(p => nomination.addPoint(p.match_id, p.point));
            }
        });
    }
}