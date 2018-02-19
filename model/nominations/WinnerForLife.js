const Nomination = require('../Nomination');
const DotaParser = require('../../services/dota-parser');

class WinnerForLife extends Nomination {
}

function wonMatch(match, player_slot) {
    return DotaParser.wonMatch(match, player_slot);
}

module.exports = {
    create: () => new WinnerForLife('Пабідітіль па жизні', wonMatch, 10, 'Всі хочуть його в тіму, а хто не хоче той просто заздрЕ')
};