import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";

export class OponentOwsMoney extends Nomination {
    constructor(protected points: Array<[number, number | string]> = []) {
        super(points);
        this.name = 'Не вбий суперника свого';
        this.minScore = 3;
        this.msg = 'Суперник гроші винен\n0 вбивств у 3х чи більше матчах';
    }

    public getScoreText(): string {
        return 'Матчів без вбивств: ' + this.getScore();
    }

    public getScoreDescription(): string {
        return ' не вбити жодного суперника';
    }

    public getThumbURL(): string {
        return 'https://image.ibb.co/kXpSEn/Opponent_Owns_Money.jpg';
    }

    public scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        if (!!player) {
            return !!player && player.kills === 0 ? 1 : 0;
        }
        return 0;
    }
}
