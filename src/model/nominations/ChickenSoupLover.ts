import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";

export class ChickeSoupLover extends Nomination {
    constructor(protected points: Array<[number, number | string]> = []) {
        super(points);
        this.name = 'Збирає на росіл';
        this.minScore = 3;
        this.msg = 'А як ще пояснити нащо йому всі ті кури?';
    }

    public getScoreText(): string {
        return 'Вбито кур\'єрів: ' + this.getScore();
    }

    public getScoreDescription(): string {
        return ' вбити кур\'єрів';
    }

    public getThumbURL(): string {
        return 'https://image.ibb.co/fAtMqS/currier_Killer.jpg';
    }

    public scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        if (!player) {
            return 0;
        }
        return player && player.courier_kills ? player.courier_kills : 0;
    }
}
