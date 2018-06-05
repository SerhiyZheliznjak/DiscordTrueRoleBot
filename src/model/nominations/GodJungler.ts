import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Constants from "../../Constants";
import Pair from "../Pair";

export class GodJungler extends Nomination {
    constructor(protected points: Array<Pair<number, number | string>> = []) {
        super(points);
        this.name = 'Лісник від Бога (нє)';
        this.minScore = 3;
        this.msg = 'Якісь кріпи незбалансовані!\n'
            + 'Вмер від нейтрального кріпа не менше 3х разів';
    }

    public getScoreText(): string {
        return 'Кількість смертей від кріпів: ' + this.getScore();
    }

    public getScoreDescription(): string {
        return ' вмерти від кріпів';
    }

    public getThumbURL(): string {
        return 'https://image.ibb.co/dpc0A8/creeps_are_a_huge_part_of_every_dota_2_match.jpg';
    }

    public scorePoint(match, player_slot) {
        if (!match) {
            return 0;
        }
        const player = DotaParser.getPlayerInfo(match, player_slot);
        if (!player || !player.killed_by) {
            return 0;
        }
        let killedByNeutralCount = 0;
        for (const killer in player.killed_by) {
            if (killer.indexOf('npc_dota_neutral') > -1) {
                killedByNeutralCount += player.killed_by[killer];
            }
        }
        return killedByNeutralCount;
    }
}
