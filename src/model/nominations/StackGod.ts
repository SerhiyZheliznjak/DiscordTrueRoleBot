import { Nomination } from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import { Constants } from "../../Constants";
import { Point } from "../Point";

export class StackGod extends Nomination {
    constructor(protected points?: Point[]) {
        super(points);
        this.name = 'Скиртувальник 1го розряду';
        this.minScore = 20;
        this.msg = 'То певно той що джунглі персувати помагав';
    }

    protected scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        return !!player && player.camps_stacked;
    }
}