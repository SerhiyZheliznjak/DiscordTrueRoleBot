import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Constants from "../../Constants";
import Pair from "../Pair";

export class Donor extends Nomination {
    constructor(protected points: Array<Pair<number, number | string>> = []) {
        super(points);
        this.name = 'Донор';
        this.minScore = 3;
        this.msg = 'Благородне діло, но не в доті';
    }

    public getScoreText(): string {
        return 'Віддано першої крові: ' + this.getScore();
    }

    public getScoreDescription(): string {
        return ' віддатись на першу кров';
    }

    public getThumbURL(): string {
        return 'https://image.ibb.co/eSTLZn/DONOR.jpg';
    }

    protected scorePoint(match, player_slot) {
        if (!match) {
            return 0;
        }
        const objectives = DotaParser.getObjectives(match);
        const fbObjective = !!objectives ? objectives.find(obj => obj.type === Constants.OBJECTIVE_FB) : undefined;
        return !!fbObjective ? fbObjective.key === player_slot ? 1 : 0 : 0;
    }
}
