import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";

export class MotherOfGod extends Nomination {
    constructor(protected points: Array<[number, number | string]> = []) {
        super(points);
        this.name = 'Хуй Замочиш';
        this.minScore = 3;
        this.msg = 'Мабуть то ліпше ніж Ісус?\nНу бо нащо вміти воскресати за 3 дні, якщо тебе хрін замочиш?\n' +
            'Має 0 смертей у 3х або більше матчах';
    }

    public getScoreText(): string {
        return 'Матчі без смертей: ' + this.getScore();
    }

    public getScoreDescription(): string {
        return ' літати як метелик, жалити як бджола';
    }

    public getThumbURL(): string {
        return 'https://image.ibb.co/mdvCfS/mother_Of_God.jpg';
    }

    public scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        if (!!player) {
            return !!player && player.deaths === 0 ? 1 : 0;
        }
        return 0;
    }
}
