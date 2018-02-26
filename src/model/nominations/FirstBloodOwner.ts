import { Nomination } from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Pair from "../Pair";

export class FirstBloodOwner extends Nomination {
    constructor(protected points: Array<Pair<string, number | string>> = []) {
        super(points);
        this.name = 'Целкозбий';
        this.minScore = 1;
        this.msg = 'Є різні методи пролити першу кров. Розказувати чи ви самі знаєте?';
    }

    protected scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        return !!player ? player.firstblood_claimed : null;
    }
}
