const Nomination = require('../Nomination');
const DotaParser = require('../../services/dota-parser');

class Parkinson extends Nomination {
}

function getActionCount(match, player_slot) {
    const player = DotaParser.getPlayerInfo(match, player_slot);
    return !!player ? player.actions_per_min : null;
}

module.exports = {
    create: () => new Parkinson('Паркінсон', getActionCount, 1, 'Якщо то не Tee Hee то скиньтесь йому по 5 гривень')
};