import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Constants from "../../Constants";
import Pair from "../Pair";

export class PingMaster extends Nomination {
    constructor(protected points: Array<Pair<string, number|string>> = []) {
        super(points);
        this.name = 'Майстер Пінг';
        this.minScore = 100;
        this.msg = 'Мабуть, він вірить в силу пінга, а також телекінез, магію і Святого Миколая';
    }

    public getScore() {
        const pings = this.points.map(p => parseInt(p.p2 + ''));
        return Math.max(...pings);
    }

    protected scorePoint(match, player_slot) {
        if (!!match) {
            return DotaParser.getPlayerInfo(match, player_slot).pings;
        }
        return 0;
    }
}
