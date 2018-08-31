import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";

export class WinnerForLife extends Nomination {
    constructor(protected points: Array<[number, number | string]> = []) {
        super(points);
        this.name = 'Пабідітіль па жизні';
        this.minScore = 15;
        this.msg = 'Всі хочуть його в тіму, а хто не хоче той просто заздрит\nБільше 15ти перемог';
    }

    public getScoreText(): string {
        return 'Виграно матчів: ' + this.getScore();
    }

    public getScoreDescription(): string {
        return ' виграти матчів';
    }

    public getThumbURL(): string {
        return 'https://image.ibb.co/gHGJLS/winner_For_Life.jpg';
    }

    public scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        if (!!player) {
            return player && player.win ? player.win : 0;
        }
        return 0;
    }
}
