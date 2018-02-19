const Nomination = require('../Nomination');
const DotaParser = require('../../services/dota-parser');

class Looser extends Nomination {
}

function wonMatchNotReally(match, player_slot) {
    return !DotaParser.wonMatch(match, player_slot);
}

module.exports = {
    create: () => new Looser('Шота не йде', wonMatchNotReally, 10, 'Всьо то саме що пабідітіль, от тільки не то щоб його в тіму хтіли, та й не дуже й заздрят')
};