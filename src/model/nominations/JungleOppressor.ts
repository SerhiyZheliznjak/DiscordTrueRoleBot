import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";

export class JungleOppressor extends Nomination {
    constructor(protected points: Array<[number, number | string]> = []) {
        super(points);
        this.name = 'Гнобитель Джунглів';
        this.minScore = 1;
        this.msg = 'Пацани не шарю що ви там робите, але я цілі джунглі пресую!\n'
            + 'Наніс більше шкоди лісним кріпам ніж героям, кріпам і будівлям разом взятим';
    }

    public getScoreText(): string {
        return 'Кількість матчів з цим "досягненням": ' + this.getScore();
    }

    public getScoreDescription(): string {
        return ' гнобити джунглі протягом числа матчів';
    }

    public getThumbURL(): string {
        return 'https://image.ibb.co/b1XsfS/Jungler.jpg';
    }

    public scorePoint(match, player_slot) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        if (!player || !player.damage) {
            return 0;
        }
        let jungleDamaged = 0;
        let objectiveDamage = 0;
        for (const target in player.damage) {
            if (player.damage.hasOwnProperty(target)) {
                if (target.indexOf('npc_dota_neutral') === 0) {
                    jungleDamaged += player.damage[target];
                } else {
                    objectiveDamage += player.damage[target];
                }
            }
        }
        return jungleDamaged > objectiveDamage ? 1 : 0;
    }
}
