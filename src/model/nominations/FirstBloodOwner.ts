import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Pair from "../Pair";

export class FirstBloodOwner extends Nomination {
    constructor(protected points: Array<Pair<number, number | string>> = []) {
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
        return 'https://www.dropbox.com/s/e4yuqx7yafnfutg/FirstBlood.jpg';
    }

    protected scorePoint(match, player_slot) {
        if (!match) {
            return 0;
        }
        const player = DotaParser.getPlayerInfo(match, player_slot);
        return !!player && player.firstblood_claimed ? player.firstblood_claimed : 0;
    }
}
