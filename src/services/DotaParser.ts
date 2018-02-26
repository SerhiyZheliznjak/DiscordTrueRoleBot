import { MatchJson, PlayerJson } from "../dota-api/DotaJsonTypings";

export class DotaParser {
    public static getPlayerInfo(match: MatchJson, player_slot: number): PlayerJson {
        return !!match ? match.players.find(player => player.player_slot === player_slot) : undefined;
    }

    public static getObjectives(match: MatchJson) {
        return !!match ? match.objectives : undefined;
    }

    public static getPlayerSlot(match: MatchJson, account_id: number) {
        const player = match.players.find(p => p.account_id === account_id);
        if (player) {
            return player.player_slot;
        }
    }
}
