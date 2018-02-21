import { Nomination } from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import { Constants } from "../../Constants";
import { Point } from "../Point";

export class RapunzelSyndrome extends Nomination {
    constructor(protected points?: Point[]) {
        super(points);
        this.name = 'Синдром Рапунзель';
        this.minScore = 1;
        this.msg = 'Вежу ліпше знести ніж в ній сидіти';
    }

    // this way it counts if team killed towers, if want to award for all towers kill then just check if player.towers_killed === 10
    protected scorePoint(match, player_slot) {
        const objectives = DotaParser.getObjectives(match);
        const player = DotaParser.getPlayerInfo(match, player_slot);
        if (!objectives || !player) {
            return null;
        }
        const towerIdentifier = player.isRadiant ? Constants.DIRE_TOWER_TARGET_IDENTIFIER : Constants.RADIANT_TOWER_TARGET_IDENTIFIER;
        const killedAllTowers = objectives.filter(obj => !!obj.key && !!obj.key.indexOf && obj.key.indexOf(towerIdentifier) === 0)
            .every(obj => obj.player_slot === player_slot);
        return killedAllTowers ? 1 : 0;
    }
}