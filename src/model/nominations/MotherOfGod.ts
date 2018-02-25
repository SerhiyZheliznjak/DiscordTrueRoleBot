import { Nomination } from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Pair from "../Pair";

export class MotherOfGod extends Nomination {
    constructor(protected points: Pair<string, number | string>[] = []) {
        super(points);
        this.name = 'Матка Бозька';
        this.minScore = 10;
        this.msg = 'Я лічно не вірю що це хтось досягне';
    }

    protected scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        return !!player && player.deaths === 0 ? 1 : 0;
    }
}