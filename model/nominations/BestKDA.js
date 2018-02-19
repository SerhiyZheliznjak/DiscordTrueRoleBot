const Nomination = require('../Nomination');
const DotaParser = require('../../services/dota-parser');

class BestKDA extends Nomination {
    getScore() {
        const bestKDA = this.getPoints().map(p => p.point).reduce((max, next) => {
            if (countKDA(max) < countKDA(next)) {
                return next;
            }
            return max;
        }, '0/0/0');
        return bestKDA;
    }
    hasHigherScoreThen(that) {
        return countKDA(this.getScore()) > countKDA(that.getScore());
    }
    isScored() {
        console.log(this.getScore());
        return this.getScore() !== '0/0/0';
    }
}

function countKDA(kdaString) {
    if(!kdaString) {
        return 0;
    }
    const kda = kdaString.split('/');
    return (parseInt(kda[0]) + parseInt(kda[2])) / (parseInt(kda[1]) + 1);
}

function getKDA(match, player_slot) {
    const player = DotaParser.getPlayerInfo(match, player_slot);
    const wonMatch = player.isRadiant ? player.radiant_win : !player.radiant_win;
    const matchResult = wonMatch ? 'ЗАТАЩИВ' : 'ТІМА ДНО';
    return !!player && player.kills !== null && player.deaths !== null && player.assists !== null
        ? player.kills + '/' + player.deaths + '/' + player.assists + '/' + matchResult
        : null;
}

module.exports = {
    create: () => new BestKDA('А шо то в вас? KDA?', getKDA, 1, 'От в мене KDA то KDA')
};