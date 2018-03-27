import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Constants from "../../Constants";
import Pair from "../Pair";

export class StackGod extends Nomination {
    constructor(protected points: Array<Pair<number, number | string>> = []) {
        super(points);
        this.name = 'Скиртувальник 1го розряду';
        this.minScore = 20;
        this.msg = 'То певно той що джунглі персувати помагав\nНайбільша кількість скирт';
    }

    public getScoreText(): string {
        return 'Наскиртовано таборів: ' + this.getScore();
    }

    public getScoreDescription(): string {
        return ' наскиртувати таборів ';
    }

    protected scorePoint(match, player_slot) {
        if (!!match) {
            const player = DotaParser.getPlayerInfo(match, player_slot);
            return !!player && player.camps_stacked ? player.camps_stacked : 0;
        }
        return 0;
    }
}
