const Nomination = require('../Nomination');
const dotaParser = require('../../services/dota-parser');
const constants = require('../../constants');

// this way it counts team killed towers, if want to award for all towers kill then just check if player.towers_killed === 10
function isAngryWithTowers(match, player_slot) {
    const objectives = dotaParser.getObjectives(match);
    const player = dotaParser.getPlayerInfo(match, player_slot);
    if (!objectives || !player) {
        return null;
    }
    const towerIdentifier = player.isRadiant ? constants.DIRE_TOWER_TARGET_IDENTIFIER() : constants.RADIANT_TOWER_TARGET_IDENTIFIER();
    const killedAllTowers = objectives.filter(obj => !!obj.key && !!obj.key.indexOf && obj.key.indexOf(towerIdentifier) === 0)
        .every(obj => obj.player_slot === player_slot);
    return killedAllTowers ? 1 : 0;
}

module.exports = {
    create: () => new Nomination('Синдром Рапунзель', isAngryWithTowers, 'Вежу ліпше знести ніж в ній сидіти')
}