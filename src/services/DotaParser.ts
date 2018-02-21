export class DotaParser {
    public static getPlayerInfo(match, player_slot: number) {
        return !!match ? match.players.find(player => player.player_slot === player_slot) : undefined;
    }
    
    public static getObjectives(match) {
        return !!match ? match.objectives: undefined;
    }
}