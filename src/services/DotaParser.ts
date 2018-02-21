import { MatchJson } from "../dota-api/DotaJsonTypings";

export class DotaParser {
    public static getPlayerInfo(match: MatchJson, player_slot: number) {
        return !!match ? match.players.find(player => player.player_slot === player_slot) : undefined;
    }
    
    public static getObjectives(match: MatchJson) {
        return !!match ? match.objectives: undefined;
    }
}