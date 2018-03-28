import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Pair from "../Pair";

export class Looser extends Nomination {
    constructor(protected points: Array<Pair<number, number | string>> = []) {
        super(points);
        this.name = 'Шота не йде';
        this.minScore = 10;
        this.msg = 'Всьо то саме що пабідітіль, от тільки не то щоб його в тіму хтіли, та й не дуже то заздрят\n' +
            'Переживає смугу програшів';
    }

    public getScoreText(): string {
        return 'Програно матчів: ' + this.getScore();
    }

    public getScoreDescription(): string {
        return ' перемогти, тільки навпаки';
    }

    public getThumbURL(): string {
        return 'https://www.dropbox.com/s/v16doe6rq6q0l5j/looser.png';
    }

    protected scorePoint(match, player_slot) {
        if (!!match) {
            const player = DotaParser.getPlayerInfo(match, player_slot);
            return player && player.lose ? player.lose : 0;
        }
        return 0;
    }
}
