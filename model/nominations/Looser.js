const Nomination = require('../Nomination');
const DotaParser = require('../../services/dota-parser');

class Looser extends Nomination {
}

function wonMatchNotReally(match, player_slot) {
    if (!!match) {
        return DotaParser.getPlayerInfo(match, player_slot).lose;
    }
    return 0;
}

module.exports = {
    create: () => new Looser('Шота не йде', wonMatchNotReally, 10, 'Всьо то саме що пабідітіль, от тільки не то щоб його в тіму хтіли, та й не дуже то заздрят')
};