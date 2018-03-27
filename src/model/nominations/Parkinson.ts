import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Constants from "../../Constants";
import Pair from "../Pair";

export class Parkinson extends Nomination {
    constructor(protected points: Array<Pair<number, number | string>> = []) {
        super(points);
        this.name = 'Паркінсон';
        this.minScore = 100;
        this.msg = 'Як крілик, бо не факт що крілики каждий раз попадають там де цілились\n'
            + 'Найбільше дій за хвилину у одному з матчів';
    }

    public getScoreText(): string {
        return 'Дій за хвилину: ' + this.getScore();
    }

    public getScore() {
        const apmArr = this.getPoints().map(p => parseInt(p.p2 + ''));
        return Math.max(...apmArr);
    }

    public getScoreDescription(): string {
        return ' понацикувати за хвилину ';
    }

    protected scorePoint(match, player_slot) {
        if (!!match) {
            const player = DotaParser.getPlayerInfo(match, player_slot);
            return !!player && player.actions_per_min ? player.actions_per_min : 0;
        }
        return 0;
    }
}
