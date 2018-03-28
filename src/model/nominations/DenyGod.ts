import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Pair from "../Pair";

export class DenyGod extends Nomination {
    constructor(protected points: Array<Pair<number, number | string>> = []) {
        super(points);
        this.name = 'Заперечувач';
        this.minScore = 10;
        this.msg = 'Сам не гам і ворогу не дам!';
    }

    public getScoreText(): string {
        return 'Заперечено кріпів за одну гру: ' + this.getScore();
    }

    public getScore() {
        const denyArr = this.getPoints().map(p => parseInt(p.p2 + ''));
        return Math.max(...denyArr);
    }

    public getScoreDescription(): string {
        return ' заперечити кріпів за одну гру';
    }

    public getThumbURL(): string {
        return 'https://www.dropbox.com/s/4u2nnqk5h85wyzl/Denier.jpg';
    }

    protected scorePoint(match, player_slot) {
        if (!match) {
            return 0;
        }
        const player = DotaParser.getPlayerInfo(match, player_slot);
        return player && player.denies ? player.denies : 0;
    }
}
