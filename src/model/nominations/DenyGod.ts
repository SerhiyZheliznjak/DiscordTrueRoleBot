import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Pair from "../Pair";

export class DenyGod extends Nomination {
    constructor(protected points: Array<Pair<string, number | string>> = []) {
        super(points);
        this.name = 'Заперечувач';
        this.minScore = 10;
        this.msg = 'Сам не гам і ворогу не дам!\nЗаперечив найбільше кріпів за одну гру';
    }

    public getScore() {
        const denyArr = this.getPoints().map(p => parseInt(p.p2 + ''));
        return Math.max(...denyArr);
    }

    protected scorePoint(match, player_slot) {
        if (!match) {
            return 0;
        }
        const player = DotaParser.getPlayerInfo(match, player_slot);
        return player && player.denies ? player.denies : 0;
    }
}
