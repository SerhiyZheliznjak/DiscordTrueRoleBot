import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Constants from "../../Constants";

export class Donor extends Nomination {
    constructor(protected points: Array<[number, number | string]> = []) {
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
        return 'https://image.ibb.co/gZYzc7/DONOR.jpg';
    }

    public scorePoint(match, player_slot) {
        const objectives = DotaParser.getObjectives(match);
        if (!objectives) {
            return 0;
        }
        const fbObjective = objectives.find(obj => obj.type === 'CHAT_MESSAGE_FIRSTBLOOD');
        return !!fbObjective ? fbObjective.key === player_slot ? 1 : 0 : 0;
    }
}
