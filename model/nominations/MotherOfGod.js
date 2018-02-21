const Nomination = require('../Nomination');
const DotaParser = require('../../services/dota-parser');

class MotherOfGod extends Nomination {
}

function didntDieOnes(match, player_slot) {
    const player = DotaParser.getPlayerInfo(match, player_slot);
    return !!player && player.deaths === 0 ? 1 : 0;
}

module.exports = {
    create: () => new MotherOfGod('Матка Бозька', didntDieOnes, 10, 'Я лічно не вірю що це хтось досягне')
};