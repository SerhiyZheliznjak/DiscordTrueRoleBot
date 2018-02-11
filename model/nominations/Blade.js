const Nomination = require('../Nomination');
const dotaParser = require('../../services/dota-parser');

function isFirstBloodOwner(match, player_slot) {
    const player = dotaParser.getPlayerInfo(match, player_slot);
    return !!player ? player.firstblood_claimed : null;
}

module.exports = {
    create: () => new Nomination('Блейд', isFirstBloodOwner, 1, 'Першу кров пролити то вам не целку збити')
}