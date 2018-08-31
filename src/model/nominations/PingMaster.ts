import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";

export class PingMaster extends Nomination {
    constructor(protected points: Array<[number, number|string]> = []) {
        super(points);
        this.name = 'Майстер Пінг';
        this.minScore = 50;
        this.msg = 'Мабуть, він вірить в силу пінга, а також телекінез, магію і Святого Миколая\n'
        + 'Напінгав 50 і більше разів у матчі';
    }

    public getScoreText(): string {
        return 'Кількість пінгів: ' + this.getScore();
    }

    public getScoreDescription(): string {
        return ' напінгати';
    }

    public getScore() {
        const pings = this.points.map(p => parseInt(p[1] + ''));
        return Math.max(...pings);
    }

    public getThumbURL(): string {
        return 'https://image.ibb.co/id89S7/Master_Ping.jpg';
    }

    public scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        if (!!player) {
            return player && player.pings ? player.pings : 0;
        }
        return 0;
    }
}
