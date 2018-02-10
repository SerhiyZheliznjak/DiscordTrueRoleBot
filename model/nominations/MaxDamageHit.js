const Nomination = require('../Nomination');
const DotaParser = require('../../services/dota-parser');

function getMaxDamage(match, player_slot) {
    const player = DotaParser.getPlayerInfo(match, player_slot);
    return !!player && !!player.max_hero_hit && !!player.max_hero_hit.value ? player.max_hero_hit.value : null;
}

module.exports = {
    create: () => new Nomination('Людогуб', getMaxDamage, 'Той хто б\'є раз, але сильно')
};