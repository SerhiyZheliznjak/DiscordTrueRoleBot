import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Pair from "../Pair";
import { PlayerJson } from "../../dota-api/DotaJsonTypings";

export class TacticalFeeder extends Nomination {
    constructor(protected points: Array<Pair<number, number | string>> = []) {
        super(points);
        this.name = 'Тактичний Фідер';
        this.minScore = 1;
        this.msg = 'Мета реально працює\nВмер не менше 10 разів, але виграв матч';
    }

    public getScoreText(): string {
        return 'Виграно матчів фідженням: ' + this.getScore();
    }

    public getScoreDescription(): string {
        return ' виграти матчів безбожно фідячи ворога';
    }

    public getThumbURL(): string {
        return 'https://image.ibb.co/if1o4n/Tactical_Feeder.jpg';
    }

    public scorePoint(match, player_slot): number {
        if (!!match) {
            const player: PlayerJson = DotaParser.getPlayerInfo(match, player_slot);
            return player && player.deaths && player.deaths > 10 && player.win === 1 ? 1 : 0;
        }
        return 0;
    }
}
