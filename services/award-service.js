const Rx = require('rxjs');
const DataStore = require('./data-store');
const ScoreBoard = require('../model/ScoreBoard');

function getNominationsWinners(playerScores) {
    const scoreBoard = new ScoreBoard();
    if (playerScores.find(ps => ps.hasNewMatches)) {
        playerScores.forEach(playerScore => scoreBoard.applyPlayerScores(playerScore));
    }
    return scoreBoard.getNominationsWinners();
}

function generateMessages(claimedNominations) {
    return Rx.Observable.create(messagesObserver => {
        
        DataStore.getPlayers(claimedNominations.map(cn => cn.account_id).reduce((uniq, id) => {
            if (uniq.indexOf(id) < 0) {
                uniq.push(id);
            }
            return uniq;
        }, [])).subscribe(players => {
            console.dir(claimedNominations.map(cn => cn.account_id));
            claimedNominations.forEach(claimed => {
                const player = players.find(p => +p.account_id === +claimed.account_id);
                const message = {
                    title: player.personaname + ' ' + claimed.nomination.getName(),
                    description: claimed.nomination.getMessage(),
                    profileUrl: player.profileurl,
                    avatarUrl: player.avatarmedium,
                    footer: 'Рахунок: ' + claimed.nomination.getScore()
                }
                messagesObserver.next(message);
            });
            messagesObserver.complete();
        });
    });
}

module.exports = {
    getNominationsWinners: getNominationsWinners,
    generateMessages: generateMessages
}