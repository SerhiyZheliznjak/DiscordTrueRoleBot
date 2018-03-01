import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Pair from "../Pair";

export class StunningMan extends Nomination {
    constructor(protected points: Array<Pair<string, number | string>> = []) {
        super(points);
        this.name = 'Гупало Василь';
        this.minScore = 100;
        this.msg = 'Він такий приголомшливий!';
    }

    protected scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        return player && player.stuns ? player.stuns : 0;
    }
}
