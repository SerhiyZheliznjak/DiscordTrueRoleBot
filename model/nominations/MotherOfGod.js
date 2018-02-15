const Nomination = require('../Nomination');
const DotaParser = require('../../services/dota-parser');

class MotherOfGod extends Nomination {
    getScore() {
        const didntDieCount = this.getPoints().map(p=>p.point);
        return didntDieCount > 9 ? 1 : 0;
    }
}

function didntDieOnes(match, player_slot) {
    const player = DotaParser.getPlayerInfo(match, player_slot);
    return !!player && player.deaths === 0 ? 1 : 0;
}

module.exports = {
    create: () => new MotherOfGod('Матка Бозька', didntDieOnes, 1, 'Я лічно не вірю що це хтось досягне')
};