import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";

export class Pacifist extends Nomination {
    constructor(protected points: Array<[number, number | string]> = []) {
        super(points);
        this.name = 'Пацифіст';
        this.minScore = 60;
        this.msg = 'Найнижча участь у командних бійках';
    }

    public getScore(): number {
        const pointsSum = this.getPoints().reduce((sum: number, p) => sum + (+p[1] * 100), 0);
        return Math.round(pointsSum / this.getPoints().length);
    }

    public getScoreText(): string {
        return 'Відсоток участі: ' + (100 - this.getScore());
    }

    public getScoreDescription(): string {
        return ' приймати участь у командних бійках';
    }

    public getThumbURL(): string {
        return 'https://image.ibb.co/nqS3n7/hippie.jpg';
    }

    public scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        if (!player) {
            return 0;
        }
        return player && player.teamfight_participation ? 1 - player.teamfight_participation : 0;
    }
}
