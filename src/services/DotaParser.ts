import { MatchJson, PlayerJson } from "../dota-api/DotaJsonTypings";

export class DotaParser {
    public static getPlayerInfo(match: MatchJson, player_slot: number): PlayerJson {
        if (match && match.players) {
            return match.players.find(player => player.player_slot === player_slot);
        }
        return undefined;
    }

    public static getObjectives(match: MatchJson) {
        return !!match ? match.objectives : undefined;
    }

    public static getPlayerSlot(match: MatchJson, account_id: number): number {
        let player;
        if (match && match.players) {
            player = match.players.find(p => p.account_id === account_id);
        }
        if (player) {
            return player.player_slot;
        }
    }
}
