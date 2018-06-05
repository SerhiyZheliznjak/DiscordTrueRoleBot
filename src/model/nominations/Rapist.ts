import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Pair from "../Pair";

export class Rapist extends Nomination {
    constructor(protected points: Array<Pair<number, number | string>> = []) {
        super(points);
        this.name = 'Рапіст';
        this.minScore = 1;
        this.msg = 'Купив рапіру та переміг';
    }

    public getScoreText(): string {
        return 'Куплено рапір у виграних матчах: ' + this.getScore();
    }

    public getScoreDescription(): string {
        return ' понакупляти рапір та ще й перемогти';
    }

    public getThumbURL(): string {
        return 'https://image.ibb.co/esN9Kx/rapier_winner.png';
    }

    public scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        if (!!player) {
            return player && player.purchase_rapier && player.win === 1 ? player.purchase_rapier : 0;
        }
        return 0;
    }
}
