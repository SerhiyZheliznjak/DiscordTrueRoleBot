import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Pair from "../Pair";

export class BadRapist extends Nomination {
    constructor(protected points: Array<Pair<number, number | string>> = []) {
        super(points);
        this.name = 'Такий собі рапірщик';
        this.minScore = 1;
        this.msg = 'Поганому рапірщику яйця мішають... Купив рапіру і програв';
    }

    public getScoreText(): string {
        return 'Куплено рапір у програних матчах: ' + this.getScore();
    }

    public getScoreDescription(): string {
        return ' понакупляти рапір і програли';
    }

    public getThumbURL(): string {
        return 'https://image.ibb.co/bHyf9x/Rapier_Loose.jpg';
    }

    public scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        if (!!player) {
            return player && player.purchase_rapier && player.win !== null && !player.win ? player.purchase_rapier : 0;
        }
        return 0;
    }
}
