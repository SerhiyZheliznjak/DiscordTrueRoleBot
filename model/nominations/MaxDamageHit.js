const Nomination = require('../Nomination');
const DotaParser = require('../../services/dota-parser');
const util = require('util');

const am_lvl_1_hp = 640;

class MaxDamageHit extends Nomination {
    getScore() {
        const dmgArr = this.getPoints().map(p=>p.point);
        return Math.max(...dmgArr);
    }
    getMessage() {
        return util.format(this._msg, roundToTwoDec(this.getScore()/am_lvl_1_hp));
    }
}

function roundToTwoDec(num) {
    return Math.round(num * 100) / 100;
}

function getMaxDamage(match, player_slot) {
    const player = DotaParser.getPlayerInfo(match, player_slot);
    return !!player && !!player.max_hero_hit && !!player.max_hero_hit.value ? player.max_hero_hit.value : null;
}

module.exports = {
    create: () => new MaxDamageHit('Вірастюк', getMaxDamage, am_lvl_1_hp, 'Йобне раз, але сильно. Вбив %s антимагів одиним ударом!')
};