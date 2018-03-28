import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Pair from "../Pair";
import { PlayerJson } from "../../dota-api/DotaJsonTypings";

export class ThisTimeItWillWork extends Nomination {
    constructor(protected points: Array<Pair<number, number | string>> = []) {
        super(points);
        this.name = 'Шяс піде';
        this.minScore = 5;
        this.msg = 'То не просто так в народі кажуть - складай на байбек з молоду\nБайбекнувся і виграв';
    }

    public getScoreText(): string {
        return 'Сума викупів у виграних матчах: ' + this.getScore();
    }

    public getScoreDescription(): string {
        return ' викупитись і виграти';
    }

    public getThumbURL(): string {
        return 'https://image.ibb.co/n1AZun/buyback.png';
    }

    public scorePoint(match, player_slot): number {
        if (!!match) {
            const player: PlayerJson = DotaParser.getPlayerInfo(match, player_slot);
            return player && player.buyback_count && player.win === 1 ? player.buyback_count : 0;
        }
        return 0;
    }
}
