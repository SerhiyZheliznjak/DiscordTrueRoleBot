import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Constants from "../../Constants";
import Pair from "../Pair";

export class JungleOppressor extends Nomination {
    constructor(protected points: Array<Pair<string, number | string>> = []) {
        super(points);
        this.name = 'Гнобитель Джунглів';
        this.minScore = 1;
        this.msg = 'Пацани не шарю що ви там робите, але я цілі джунглі пресую!';
    }

    protected scorePoint(match, player_slot) {
        if (!match) {
            return 0;
        }
        const player = DotaParser.getPlayerInfo(match, player_slot);
        if (!player || !player.damage) {
            return 0;
        }
        let jungleDamaged = 0;
        let objectiveDamage = 0;
        for (const target in player.damage) {
            if (player.damage.hasOwnProperty(target)) {
                if (target.indexOf(Constants.JUNGLE_TARGETS_IDENTIFIER) === 0) {
                    jungleDamaged += player.damage[target];
                } else {
                    objectiveDamage += player.damage[target];
                }
            }
        }
        return jungleDamaged > objectiveDamage ? 1 : 0;
    }
}
