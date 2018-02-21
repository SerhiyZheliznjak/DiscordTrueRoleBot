import { Nomination } from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import { Point } from "../Point";

export class Looser extends Nomination {
    constructor(protected points?: Point[]) {
        super(points);
        this.name = 'Шота не йде';
        this.minScore = 10;
        this.msg = 'Всьо то саме що пабідітіль, от тільки не то щоб його в тіму хтіли, та й не дуже то заздрят';
    }

    protected scorePoint(match, player_slot) {
        if (!!match) {
            return DotaParser.getPlayerInfo(match, player_slot).lose;
        }
        return 0;
    }
}