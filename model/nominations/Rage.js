const Nomination = require('../Nomination');
const DotaParser = require('../../services/dota-parser');

class Rage extends Nomination {
    getScore() {
        const pings = this._points.map(p => p.point);
        return Math.max(...pings);
    }
}

function getPingTimes(match, player_slot) {
    return DotaParser.getPlayerInfo(match, player_slot).pings;
}

module.exports = {
    create: () => new Rage('Майстер Пінг', getPingTimes, 10, 'Нема такого що не можливо виразити пінгом')
};