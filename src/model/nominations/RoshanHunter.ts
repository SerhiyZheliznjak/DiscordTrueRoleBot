import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Pair from "../Pair";

export class RoshanHunter extends Nomination {
    constructor(protected points: Array<Pair<number, number | string>> = []) {
        super(points);
        this.name = 'Рошан-хуян';
        this.minScore = 3;
        this.msg = 'Не такий страшний Рошан як його малюють';
    }

    public getScoreText(): string {
        return 'Вбито Рошанів: ' + this.getScore();
    }

    public getScoreDescription(): string {
        return ' вбити рошанів';
    }

    public getThumbURL(): string {
        return 'https://www.dropbox.com/s/nng80711fbthpy2/Roshan.jpg';
    }

    protected scorePoint(match, player_slot) {
        if (!match) {
            return 0;
        }
        const player = DotaParser.getPlayerInfo(match, player_slot);
        return player && player.roshan_kills ? player.roshan_kills : 0;
    }
}
