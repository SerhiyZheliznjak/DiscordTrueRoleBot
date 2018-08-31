import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";

export class DenyGod extends Nomination {
    constructor(protected points: Array<[number, number | string]> = []) {
        super(points);
        this.name = 'Заперечувач';
        this.minScore = 10;
        this.msg = 'Сам не гам і ворогу не дам!';
    }

    public getScoreText(): string {
        return 'Заперечено кріпів за одну гру: ' + this.getScore();
    }

    public getScore() {
        const denyArr = this.getPoints().map(p => parseInt(p[1] + ''));
        return Math.max(...denyArr);
    }

    public getScoreDescription(): string {
        return ' заперечити кріпів за одну гру';
    }

    public getThumbURL(): string {
        return 'https://image.ibb.co/gGMk0S/Denier.jpg';
    }

    public scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        if (!player) {
            return 0;
        }
        return player && player.denies ? player.denies : 0;
    }
}
