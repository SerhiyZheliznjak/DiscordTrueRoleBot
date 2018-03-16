import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Pair from "../Pair";
import { PlayerJson } from "../../dota-api/DotaJsonTypings";

export class TacticalFeeder extends Nomination {
    constructor(protected points: Array<Pair<string, number | string>> = []) {
        super(points);
        this.name = 'Тактичний Фідер';
        this.minScore = 1;
        this.msg = 'Мета реально працює';
    }

    protected scorePoint(match, player_slot): number {
        if (!!match) {
            const player: PlayerJson = DotaParser.getPlayerInfo(match, player_slot);
            return player && player.deaths && player.deaths > 10 && player.win === 1 ? 1 : 0;
        }
        return 0;
    }
}
