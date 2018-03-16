import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Pair from "../Pair";

export class TacticalFeeder extends Nomination {
    constructor(protected points: Array<Pair<string, number | string>> = []) {
        super(points);
        this.name = 'Тактичний Фідер';
        this.minScore = 1;
        this.msg = 'Мета реально працює';
    }

    protected scorePoint(match, player_slot): number {
        if (!!match) {
            const player = DotaParser.getPlayerInfo(match, player_slot);
            return player && player.deaths && player.deaths > 10 && player.win ? 1 : 0;
        }
        return 0;
    }
}
