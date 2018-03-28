import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Constants from "../../Constants";
import Pair from "../Pair";

export class WinnerForLife extends Nomination {
    constructor(protected points: Array<Pair<number, number | string>> = []) {
        super(points);
        this.name = 'Пабідітіль па жизні';
        this.minScore = 10;
        this.msg = 'Всі хочуть його в тіму, а хто не хоче той просто заздрит\nБільше 10ти перемог';
    }

    public getScoreText(): string {
        return 'Виграно матчів: ' + this.getScore();
    }

    public getScoreDescription(): string {
        return ' виграти матчів';
    }

    public getThumbURL(): string {
        return 'https://www.dropbox.com/s/qo5mfwo84h2k6p8/winnerForLife.jpg?dl=0';
    }

    protected scorePoint(match, player_slot) {
        if (!!match) {
            const player = DotaParser.getPlayerInfo(match, player_slot);
            return player && player.win ? player.win : 0;
        }
        return 0;
    }
}
