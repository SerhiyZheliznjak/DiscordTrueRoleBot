import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Constants from "../../Constants";
import Pair from "../Pair";

export class Donor extends Nomination {
    constructor(protected points: Array<Pair<string, number | string>> = []) {
        super(points);
        this.name = 'Донор';
        this.minScore = 1;
        this.msg = 'Благородне діло, но не в доті';
    }

    protected scorePoint(match, player_slot) {
        const objectives = DotaParser.getObjectives(match);
        const fbObjective = !!objectives ? objectives.find(obj => obj.type === Constants.OBJECTIVE_FB) : undefined;
        return !!fbObjective ? fbObjective.key === player_slot ? 1 : 0 : null;
    }
}
