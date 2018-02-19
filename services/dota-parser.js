function getPlayerInfo(match, player_slot) {
    return !!match ? match.players.find(player => player.player_slot === player_slot) : undefined;
}

function getObjectives(match) {
    return !!match ? match.objectives: undefined;
}

function wonMatch(match, player_slot) {
    const player = getPlayerInfo(match, player_slot);
    return player && player.isRadiant ? player.radiant_win : !player.radiant_win;
}

module.exports = {
    getPlayerInfo: getPlayerInfo,
    getObjectives: getObjectives,
    wonMatch: wonMatch
}