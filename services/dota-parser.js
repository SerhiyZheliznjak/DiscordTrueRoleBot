function getPlayerInfo(match, player_slot) {
    return !!match ? match.players.find(player => player.player_slot === player_slot) : undefined;
}

function getObjectives(match) {
    return !!match ? match.objectives: undefined;
}

module.exports = {
    getPlayerInfo: getPlayerInfo,
    getObjectives: getObjectives
}