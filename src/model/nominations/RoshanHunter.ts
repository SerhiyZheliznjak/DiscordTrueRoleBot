import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";

export class RoshanHunter extends Nomination {
    constructor(protected points: Array<[number, number | string]> = []) {
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
        return 'https://image.ibb.co/i8JLZn/Roshan.jpg';
    }

    public scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        if (!player) {
            return 0;
        }
        return player && player.roshan_kills ? player.roshan_kills : 0;
    }
}
