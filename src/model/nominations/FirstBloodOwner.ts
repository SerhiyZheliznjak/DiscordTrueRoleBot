import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";

export class FirstBloodOwner extends Nomination {
    constructor(protected points: Array<[number, number | string]> = []) {
        super(points);
        this.name = 'Власнить першу кров';
        this.minScore = 3;
        this.msg = 'Є різні методи то пролити... Вам розказувати чи самі знаєте?';
    }

    public getScoreText(): string {
        return 'Пролито першої крові: ' + this.getScore();
    }

    public getScoreDescription(): string {
        return ' пролити першу кров';
    }

    public getThumbURL(): string {
        return 'https://image.ibb.co/iTHQ0S/First_Blood.jpg';
    }

    public scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        if (!player) {
            return 0;
        }
        return !!player && player.firstblood_claimed ? player.firstblood_claimed : 0;
    }
}
