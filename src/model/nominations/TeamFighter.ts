import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Pair from "../Pair";

export class TeamFighter extends Nomination {
    constructor(protected points: Array<Pair<number, number | string>> = []) {
        super(points);
        this.name = 'Командний Боєць';
        this.minScore = 50;
        this.msg = 'Найвищий середній показник участі в командних бійках';
    }

    public getScore(): number {
        const pointsSum = this.getPoints().reduce((sum: number, p) => sum + (+p.p2 * 100), 0);
        return Math.round(pointsSum / this.getPoints().length);
    }

    public getScoreText(): string {
        return 'Відсоток участі: ' + this.getScore();
    }

    public getScoreDescription(): string {
        return ' приймати участь у командних бійках ';
    }

    protected scorePoint(match, player_slot) {
        if (!match) {
            return 0;
        }
        const player = DotaParser.getPlayerInfo(match, player_slot);
        return player && player.teamfight_participation ? player.teamfight_participation : 0;
    }
}
