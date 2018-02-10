const Nomination = require('../Nomination');
const dotaParser = require('../../services/dota-parser');
const constants = require('../../constants');

function isDonor(match, player_slot) {
    const objectives = dotaParser.getObjectives(match);
    const fbObjective = !!objectives ? objectives.find(obj => obj.type === constants.OBJECTIVE_FB()) : undefined;
    return !!fbObjective ? fbObjective.key === player_slot ? 1 : 0 : null;
}

module.exports = {
    create: () => new Nomination('Донор', isDonor, 'Нє ну як не дати як просять?')
}