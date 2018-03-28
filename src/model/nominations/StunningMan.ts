import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Pair from "../Pair";

export class StunningMan extends Nomination {
    constructor(protected points: Array<Pair<number, number | string>> = []) {
        super(points);
        this.name = 'Гупало Василь';
        this.minScore = 100;
        this.msg = 'Він такий приголомшливий!\nНайдовше часу протримав суперників приголомшеними';
    }

    public getScoreText(): string {
        return 'Протримав ворогів у приголомшені: ' + this.getScore() + 'сек';
    }

    public getScoreDescription(): string {
        return ' протримати ворогів у приголомшенні';
    }

    public getThumbURL(): string {
        return 'https://www.dropbox.com/s/7hp4kz65g51r1nt/stunner.png?dl=0';
    }

    protected scorePoint(match, player_slot) {
        if (!!match) {
            const player = DotaParser.getPlayerInfo(match, player_slot);
            return player && player.stuns ? player.stuns : 0;
        }
        return 0;
    }
}
