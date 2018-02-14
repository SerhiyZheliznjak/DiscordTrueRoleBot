const NominationList = require('../model/NominationsList');
const Rx = require('rxjs');
const DataStore = require('./data-store');

function getNominationsWinners(playerScores) {
    if (playerScores.find(ps => ps.hasNewMatches)) {
        return NominationList.create().map((nomination, index) => {
            const nominationWithPlayersResults = playerScores.map(ps => {
                const n = ps.getNominations()[index];
                return {
                    account_id: ps.getAccountId(),
                    nomination: n,
                    score: n.getScore()
                };
            });
            const winner = nominationWithPlayersResults.reduce((winner, nwp) => {
                return nwp.score > winner.score ? nwp : winner;
            });
            return winner;
        }).filter(winner => winner.score > 0);
    } else {
        return [];
    }
}

function generateMessages(nominationsWinners) {
    return Rx.Observable.create(messagesObserver => {
        subscriptionChain(nominationsWinners.map(nominationWinner => DataStore.getPlayer(nominationWinner.account_id)),
            player => {
                DataStore.updatePlayer(player);
                const nominationWon = nominationWinner.nomination;
                messagesObserver.next({
                    title: player.personaname + ' ' + nominationWon.getName(),
                    description: nominationWon.getMessage(),
                    avatarUrl: player.avatarmedium
                });
            },
            () => {
                messagesObserver.complete();
            });
    });
}

function subscriptionChain(observables, next, complete) {
    const nextObservable = observables.shift();
    if (nextObservable) {
        nextObservable.subscribe(result => {
            next(result);
            subscriptionChain(observables);
        });
    } else {
        complete();
    }
}

// let title = util.format("%s %s his last game", p.profile.personaname, ((m.player_slot < 128 && m.radiant_win) || (m.player_slot >= 128 && !m.radiant_win)) ? "WON" : "LOST");
// let description = util.format("Hero: %s\nKDA: %s/%s/%s\n\nGame mode: %s, %s\n\nIt started at %s and lasted %s minutes",
//     enums.HEROES.find(h => h.id == m.hero_id).localized_name,
//     m.kills, m.deaths, m.assists,
//     enums.LOBBIES.find(l => l.id == m.lobby_type).name,
//     enums.MODES.find(mode => mode.id == m.game_mode).name,
//     new Date(m.start_time * 1000).toLocaleTimeString(), parseInt(m.duration / 60)
// );
// let url = util.format("https://www.dotabuff.com/matches/%s", m.match_id)
// discord.post(title, description, url, p.profile.avatarmedium);

module.exports = {
    getNominationsWinners: getNominationsWinners,
    generateMessages: generateMessages
}