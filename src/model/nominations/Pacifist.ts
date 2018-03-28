import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Pair from "../Pair";

export class Pacifist extends Nomination {
    constructor(protected points: Array<Pair<number, number | string>> = []) {
        super(points);
        this.name = 'Пацифіст';
        this.minScore = 60;
        this.msg = 'Найнижча участь у командних бійках';
    }

    public getScore(): number {
        const pointsSum = this.getPoints().reduce((sum: number, p) => sum + (+p.p2 * 100), 0);
        return Math.round(pointsSum / this.getPoints().length);
    }

    public getScoreText(): string {
        return 'Відсоток участі: ' + (100 - this.getScore());
    }

    public getScoreDescription(): string {
        return ' приймати участь у командних бійках';
    }

    public getThumbURL(): string {
        return 'https://www.dropbox.com/s/6z5kqi3y2smx2fa/hippie.jpg?dl=0';
    }

    protected scorePoint(match, player_slot) {
        if (!match) {
            return 0;
        }
        const player = DotaParser.getPlayerInfo(match, player_slot);
        return player && player.teamfight_participation ? 1 - player.teamfight_participation : 0;
    }
}
