let playersBeingObserved = 1;

module.exports = {
    OBJECTIVE_FB: () => 'CHAT_MESSAGE_FIRSTBLOOD',
    JUNGLE_TARGETS_IDENTIFIER: () => 'npc_dota_neutral',
    DIRE_TOWER_TARGET_IDENTIFIER: () => 'npc_dota_badguys_tower',
    RADIANT_TOWER_TARGET_IDENTIFIER: () => 'npc_dota_goodguys_tower',
    MATCHES_FILE_PATH: () => './storage/matches.json',
    PLAYERS_FILE_PATH: () => './storage/players.json',
    SPEC_MATCHES_FILE_PATH: () => './spec/storage/matches.json',
    SPEC_PLAYERS_FILE_PATH: () => './spec/storage/players.json',
    GetMaxMatches: () => playersBeingObserved * 20,
    setPlayersBeingObserved: count => playersBeingObserved = count
};