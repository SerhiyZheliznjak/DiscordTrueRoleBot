import Nomination from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import Constants from "../../Constants";
import Pair from "../Pair";
import { MatchJson } from "../../dota-api/DotaJsonTypings";

export class RapunzelSyndrome extends Nomination {
    constructor(protected points: Array<Pair<string, number | string>> = []) {
        super(points);
        this.name = 'Синдром Рапунзель';
        this.minScore = 1;
        this.msg = 'Вежу ліпше знести ніж в ній сидіти';
    }

    protected scorePoint(match, player_slot): number {
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
