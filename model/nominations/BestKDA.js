const Nomination = require('../Nomination');
const DotaParser = require('../../services/dota-parser');
const CONST = require('../../constants');

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
    isMyScoreHigher(scoreString) {
        return countKDA(this.getScore()) > countKDA(scoreString);
    }
    isScored() {
        return this.getScore() !== '0/0/0';
    }
}

function countKDA(kdaString) {
    if (!kdaString) {
        return 0;
    }
    const kda = kdaString.split('/');
    return (parseInt(kda[0]) + parseInt(kda[2])) / (parseInt(kda[1]) + 1);
}

function getKDA(match, player_slot) {
    if(!!match) {
        const player = DotaParser.getPlayerInfo(match, player_slot);
        const matchResult = player.win === 1 ? CONST.WON() : CONST.LOST();
        return !!player && player.kills !== null && player.deaths !== null && player.assists !== null
            ? player.kills + '/' + player.deaths + '/' + player.assists + '/' + matchResult
            : null;
    }
    return '0/0/0';
}

module.exports = {
    create: () => new BestKDA('А шо то в вас? KDA?', getKDA, 1, 'От в мене KDA то KDA')
};