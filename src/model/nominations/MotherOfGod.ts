import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Pair from "../Pair";

export class MotherOfGod extends Nomination {
    constructor(protected points: Array<Pair<string, number | string>> = []) {
        super(points);
        this.name = 'Хуй Замочиш';
        this.minScore = 3;
        this.msg = 'Мабуть то ліпше ніж Ісус?\nНу бо нащо вміти воскресати за 3 дні, якщо тебе хрін замочиш?\n' +
            'Має 0 смертей у 3х або більше матчах';
    }

    protected scorePoint(match, player_slot) {
        if (!!match) {
            const player = DotaParser.getPlayerInfo(match, player_slot);
            return !!player && player.deaths === 0 ? 1 : 0;
        }
        return 0;
    }
}
