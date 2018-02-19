const Nomination = require('../Nomination');
const DotaParser = require('../../services/dota-parser');

class LongestMatch extends Nomination {
}

function getMatchTime(match, player_slot) {
    return match.duration;
}

module.exports = {
    create: () => new LongestMatch('Шота не йде', getMatchTime, 10, 'Всьо то саме що пабідітіль, от тільки не то щоб його в тіму хтіли, та й не дуже й заздрят')
};