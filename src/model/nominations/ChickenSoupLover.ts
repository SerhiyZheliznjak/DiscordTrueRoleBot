import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Pair from "../Pair";

export class ChickeSoupLover extends Nomination {
    constructor(protected points: Array<Pair<number, number | string>> = []) {
        super(points);
        this.name = 'Збирає на росіл';
        this.minScore = 3;
        this.msg = 'А як ще пояснити нащо йому всі ті кури?';
    }

    public getScoreText(): string {
        return 'Вбито кур\'єрів: ' + this.getScore();
    }

    public getScoreDescription(): string {
        return ' вбити кур\'єрів';
    }

    public getThumbURL(): string {
        return 'https://www.dropbox.com/s/09om8yh99oqzfo6/currierKiller.jpg';
    }

    protected scorePoint(match, player_slot) {
        if (!match) {
            return 0;
        }
        const player = DotaParser.getPlayerInfo(match, player_slot);
        return player && player.courier_kills ? player.courier_kills : 0;
    }
}
