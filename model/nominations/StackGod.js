const Nomination = require('../Nomination');
const DotaParser = require('../../services/dota-parser');

class StackGod extends Nomination {
}

function getStackCount(match, player_slot) {
    const player = DotaParser.getPlayerInfo(match, player_slot);
    return !!player && !!player.camps_stacked ? player.camps_stacked : null;
}

module.exports = {
    create: () => new StackGod('Скиртувальник 1го розряду', getStackCount, 1, 'То певно той що джунглі персувати помагав')
};