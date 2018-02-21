import { Nomination } from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import { Point } from "../Point";

export class MotherOfGod extends Nomination {
    constructor(protected points?: Point[]) {
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