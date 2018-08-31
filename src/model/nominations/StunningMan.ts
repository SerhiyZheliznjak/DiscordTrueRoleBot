import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";

export class StunningMan extends Nomination {
    constructor(protected points: Array<[number, number | string]> = []) {
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
        return 'https://image.ibb.co/fTpin7/stunner.png';
    }

    public scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        if (!!player) {
            return player && player.stuns ? player.stuns : 0;
        }
        return 0;
    }
}
