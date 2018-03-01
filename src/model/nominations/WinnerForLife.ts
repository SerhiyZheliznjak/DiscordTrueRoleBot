import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Constants from "../../Constants";
import Pair from "../Pair";

export class WinnerForLife extends Nomination {
    constructor(protected points: Array<Pair<string, number | string>> = []) {
        super(points);
        this.name = 'Пабідітіль па жизні';
        this.minScore = 10;
        this.msg = 'Всі хочуть його в тіму, а хто не хоче той просто заздрЕ';
    }

    protected scorePoint(match, player_slot) {
        if (!!match) {
            return DotaParser.getPlayerInfo(match, player_slot).win;
        }
        return 0;
    }
}
