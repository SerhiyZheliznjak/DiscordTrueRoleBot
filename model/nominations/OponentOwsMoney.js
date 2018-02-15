const Nomination = require('../Nomination');
const DotaParser = require('../../services/dota-parser');

class OponentOwsMoney extends Nomination {
    getScore() {
        const killsCount = this.getPoints().map(p=>p.point);
        return killsCount > 9 ? 1 : 0;
    }
}

function killsCount(match, player_slot) {
    const player = DotaParser.getPlayerInfo(match, player_slot);
    return !!player && player.kills === 0 ? 1 : 0;
}

module.exports = {
    create: () => new OponentOwsMoney('Суперник мені гроші винен', killsCount, 1, 'Ну то тіпа капець')
};