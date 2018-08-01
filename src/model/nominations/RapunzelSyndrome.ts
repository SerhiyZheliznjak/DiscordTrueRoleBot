import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Constants from "../../Constants";
import Pair from "../Pair";
import { MatchJson } from "../../dota-api/DotaJsonTypings";

export class RapunzelSyndrome extends Nomination {
    constructor(protected points: Array<Pair<number, number | string>> = []) {
        super(points);
        this.name = 'Синдром Рапунзель';
        this.minScore = 1;
        this.msg = 'Нахєр вежі!\nДобив 5 або більше веж за матч';
    }

    public getScoreText(): string {
        return 'Добито більше 5ти веж за матч: ' + this.getScore();
    }

    public getScoreDescription(): string {
        return ' добити більше 5ти веж';
    }

    public getThumbURL(): string {
        return 'https://image.ibb.co/fA4uun/rapunzel.jpg';
    }

    public scorePoint(match, player_slot): number {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        if (!!player) {
            return player && player.tower_kills > 5 ? 1 : 0;
        }
        return 0;
    }
}
