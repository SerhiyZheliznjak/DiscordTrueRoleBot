const Nomination = require('../Nomination');
const dotaParser = require('../../services/dota-parser');

function isFirstBloodOwner(match, player_slot) {
    const player = dotaParser.getPlayerInfo(match, player_slot);
    return !!player ? player.firstblood_claimed : null;
}

module.exports = {
    create: () => new Nomination('Целкозбий', isFirstBloodOwner, 1, 'Є різні методи пролити першу кров. Розказувати чи ви самі знаєте?')
}