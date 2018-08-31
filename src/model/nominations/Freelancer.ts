import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";

export class Freelancer extends Nomination {
    constructor(protected points: Array<[number, number | string]> = []) {
        super(points);
        this.name = 'Хан Соло';
        this.minScore = 10;
        this.msg = 'Соло ММР всім ММРам ММР';
    }

    public getScoreText(): string {
        return 'Зіграно соло матчів: ' + this.getScore();
    }

    public getScoreDescription(): string {
        return ' зіграти в соляру';
    }

    public getThumbURL(): string {
        return 'https://image.ibb.co/h523n7/Pacifist.jpg';
    }

    public scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        if (!player) {
            return 0;
        }
        return player && player.party_size && player.party_size === 1 ? 1 : 0;
    }
}
