import { Nomination } from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import { Point } from "../Point";
import { Constants } from "../../Constants";
import {format} from 'util';

export class MaxDamageHit extends Nomination {
    constructor(protected points?: Point[]) {
        super(points);
        this.name = 'Вірастюк';
        this.minScore = Constants.AM_HP;
        this.msg = 'Йобне раз, але сильно. Вбив %s антимагів одиним ударом!';
    }

    protected scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        return !!player && !!player.max_hero_hit && !!player.max_hero_hit.value ? player.max_hero_hit.value : null;
    }

    getScore() {
        const dmgArr = this.getPoints().map(p=>(p.point as number));
        return Math.max(...dmgArr);
    }
    getMessage() {
        return format(this.msg, this.roundToTwoDec(this.getScore()/Constants.AM_HP));
    }

    private roundToTwoDec(num) {
        return Math.round(num * 100) / 100;
    }
}