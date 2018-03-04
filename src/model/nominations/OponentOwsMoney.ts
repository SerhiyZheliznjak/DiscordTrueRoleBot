import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Constants from "../../Constants";
import Pair from "../Pair";

export class OponentOwsMoney extends Nomination {
    constructor(protected points: Array<Pair<string, number | string>> = []) {
        super(points);
        this.name = 'Не вбий суперника свого';
        this.minScore = 5;
        this.msg = 'Суперник гроші винен';
    }

    protected scorePoint(match, player_slot) {
        if (!!match) {
            const player = DotaParser.getPlayerInfo(match, player_slot);
            return !!player && player.kills === 0 ? 1 : 0;
        }
        return 0;
    }
}
