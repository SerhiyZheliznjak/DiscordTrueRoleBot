import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Pair from "../Pair";

export class DenyGod extends Nomination {
    constructor(protected points: Array<Pair<string, number | string>> = []) {
        super(points);
        this.name = 'Заперечувало';
        this.minScore = 10;
        this.msg = 'Сам не гам і ворогу не дам!';
    }

    public getScore() {
        const denyArr = this.getPoints().map(p => parseInt(p.val + ''));
        return Math.max(...denyArr);
    }

    protected scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        return player && player.denies ? player.denies : 0;
    }
}
