import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Constants from "../../Constants";
import Pair from "../Pair";

export class Parkinson extends Nomination {
    constructor(protected points: Array<Pair<string, number | string>> = []) {
        super(points);
        this.name = 'Паркінсон';
        this.minScore = 100;
        this.msg = 'Як крілик, бо не факт що крілики каждий раз попадають там де цілились.\nЯкщо крілики взагалі вміють цілитись...';
    }

    public getScore() {
        const apmArr = this.getPoints().map(p => parseInt(p.p2 + ''));
        return Math.max(...apmArr);
    }

    protected scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        return !!player ? player.actions_per_min : null;
    }
}
