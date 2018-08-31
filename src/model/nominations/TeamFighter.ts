import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";

export class TeamFighter extends Nomination {
    constructor(protected points: Array<[number, number | string]> = []) {
        super(points);
        this.name = 'Командний Боєць';
        this.minScore = 50;
        this.msg = 'Найвищий середній показник участі в командних бійках';
    }

    public getScore(): number {
        const pointsSum = this.getPoints().reduce((sum: number, p) => sum + (+p[1] * 100), 0);
        return Math.round(pointsSum / this.getPoints().length);
    }

    public getScoreText(): string {
        return 'Відсоток участі: ' + this.getScore();
    }

    public getScoreDescription(): string {
        return ' приймати участь у командних бійках';
    }

    public getThumbURL(): string {
        return 'https://image.ibb.co/kNZuun/Team_Fighterlogo_square.png';
    }

    public scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        if (!player) {
            return 0;
        }
        return player && player.teamfight_participation ? player.teamfight_participation : 0;
    }
}
