const Nomination = require('../Nomination');
const DotaParser = require('../../services/dota-parser');

class MaxDamageHit extends Nomination {
    getScore() {
        const dmgArr = this.getPoints().map(p=>p.point);
        return Math.max(...dmgArr);
    }
}

function getMaxDamage(match, player_slot) {
    const player = DotaParser.getPlayerInfo(match, player_slot);
    return !!player && !!player.max_hero_hit && !!player.max_hero_hit.value ? player.max_hero_hit.value : null;
}

module.exports = {
    create: () => new MaxDamageHit('Людогуб', getMaxDamage, 1, 'Той хто б\'є раз, але сильно, %s ШКОДИ')
};