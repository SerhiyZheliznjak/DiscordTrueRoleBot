import { Nomination } from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import { Constants } from "../../Constants";
import Pair from "../Pair";

export class Parkinson extends Nomination {
    constructor(protected points: Array<Pair<string, number | string>> = []) {
        super(points);
        this.name = 'Паркінсон';
        this.minScore = 100;
        this.msg = 'Якщо то не Tee Hee то скиньтесь йому по 5 гривень';
    }

    protected scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        return !!player ? player.actions_per_min : null;
    }
}
