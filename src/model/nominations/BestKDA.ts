import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Constants from "../../Constants";

export class BestKDA extends Nomination {
    constructor(protected points: Array<[number, number | string]> = []) {
        super(points);
        this.name = 'А шо то в вас? KDA?';
        this.minScore = 1;
        this.msg = 'От в мене KDA то KDA';
    }

    public getScore(): number {
        const kdaArr = this.getPoints().map(p => this.countKDA(p[1] + ''));
        return Math.max(...kdaArr);
    }

    public scoreToString(): string {
        return this.getPoints().map(p => p[1] + '').reduce((max, next) => {
            if (this.countKDA(max) < this.countKDA(next)) {
                return next;
            }
            return max;
        }, '0/0/0');
    }

    public getScoreText(): string {
        return 'Накадеашив: ' + this.scoreToString();
    }

    public getScoreDescription(): string {
        return ' накадеашити';
    }

    public getThumbURL(): string {
        return `https://image.ibb.co/bvMUS7/kda.jpg`;
    }

    public scorePoint(match, player_slot): string {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        if (!!player) {
            const matchResult = player.win === 1 ? Constants.WON : Constants.LOST;
            return !!player && player.kills !== null && player.deaths !== null && player.assists !== null
                ? player.kills + '/' + player.deaths + '/' + player.assists + '/' + matchResult
                : null;
        }
        return '0/0/0';
    }

    private countKDA(kdaText: string): number {
        if (!kdaText) {
            return 0;
        }
        const kda = kdaText.split('/');
        return (parseInt(kda[0]) + parseInt(kda[2])) / (parseInt(kda[1]) + 1);
    }
}
