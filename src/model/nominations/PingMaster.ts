import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Constants from "../../Constants";
import Pair from "../Pair";

export class PingMaster extends Nomination {
    constructor(protected points: Array<Pair<string, number|string>> = []) {
        super(points);
        this.name = 'Майстер Пінг';
        this.minScore = 50;
        this.msg = 'Мабуть, він вірить в силу пінга, а також телекінез, магію і Святого Миколая\n'
        + 'Напінгав 50 і більше разів у матчі';
    }

    public getScoreText(): string {
        return 'Пінганув: ' + this.getScore() + ' разів';
    }

    public getScore() {
        const pings = this.points.map(p => parseInt(p.p2 + ''));
        return Math.max(...pings);
    }

    protected scorePoint(match, player_slot) {
        if (!!match) {
            const player = DotaParser.getPlayerInfo(match, player_slot);
            return player && player.pings ? player.pings : 0;
        }
        return 0;
    }
}
