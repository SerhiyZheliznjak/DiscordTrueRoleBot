const Nomination = require('../Nomination');
const dotaParser = require('../../services/dota-parser');
const constants = require('../../constants');

function isJungleOppressor(match, player_slot) {
    const player = dotaParser.getPlayerInfo(match, player_slot);
    if (!player || !player.damage) {
        return null;
    }
    let jungleDamaged = 0;
    let objectiveDamage = 0;
    for (var target in player.damage) {
        if (player.damage.hasOwnProperty(target)) {
            if (target.indexOf(constants.JUNGLE_TARGETS_IDENTIFIER()) === 0) {
                jungleDamaged += player.damage[target];
            } else {
                objectiveDamage += player.damage[target];
            }
        }
    }
    return jungleDamaged > objectiveDamage ? 1 : 0;
}

module.exports = {
    create: () => new Nomination('Гнобитель Джунглів', isJungleOppressor, 1, 'Пацани не шарю що ви там робите, але я цілі джунглі пресую!')
}