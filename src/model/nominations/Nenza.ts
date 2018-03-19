import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Pair from "../Pair";
import { MatchJson } from "../../dota-api/DotaJsonTypings";

export class Nenza extends Nomination {
    constructor(protected points: Array<Pair<string, number | string>> = []) {
        super(points);
        this.name = 'Ненза';
        this.minScore = 1;
        this.msg = 'Бачу тапок в закупі - report, ff, afk';
    }

    public getScoreText(): string {
        return 'Кількість написаної херні в чаті: ' + this.getScore();
    }

    protected scorePoint(match: MatchJson, player_slot: number): number {
        if (match && match.chat) {
            const nenzaMsg = match.chat.filter(msg => msg.player_slot === player_slot)
                .filter(msg => {
                    const text = msg.key ? msg.key.toLowerCase() : '';
                    return text.indexOf('ff') > -1
                        || text.indexOf('report') > -1;
                });
            return nenzaMsg.length;
        }
        return 0;
    }
}
