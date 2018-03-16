import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Pair from "../Pair";
import { PlayerJson } from "../../dota-api/DotaJsonTypings";

export class ThisTimeItWillWork extends Nomination {
    constructor(protected points: Array<Pair<string, number | string>> = []) {
        super(points);
        this.name = 'Шяс піде';
        this.minScore = 5;
        this.msg = 'То не просто так в народі кажуть - складай на байбек з молоду';
    }

    protected scorePoint(match, player_slot): number {
        if (!!match) {
            const player: PlayerJson = DotaParser.getPlayerInfo(match, player_slot);
            return player && player.buyback_count && player.win === 1 ? player.buyback_count : 0;
        }
        return 0;
    }
}
