import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import { PlayerJson } from "../../dota-api/DotaJsonTypings";

export class TacticalFeeder extends Nomination {
    private tacticalKDA: string[];

    constructor(protected points: Array<[number, number | string]> = []) {
        super(points);
        this.name = 'Тактичний Фідер';
        this.minScore = 1;
        this.tacticalKDA = [];
    }

    public get msg(): string {
        return 'Мета реально працює\nВмер не менше 10 разів, але виграв матч\n```'
            + this.tacticalKDA.join('\n') + '\n```';
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
        const player: PlayerJson = DotaParser.getPlayerInfo(match, player_slot);
        if (!!player) {
            if (player && player.deaths && player.deaths > 10 && player.win === 1) {
                this.tacticalKDA.push(player.kills + '/' + player.deaths + '/' + player.assists);
                return 1;
            } else {
                return 0;
            }
        }
        return 0;
    }
}
