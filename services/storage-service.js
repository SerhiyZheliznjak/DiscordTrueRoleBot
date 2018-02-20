const fs = require('fs');
const CONST = require('../constants');

function createPathIfNeeded(filePath) {
    const doesExist = fs.existsSync(filePath);
    if (!doesExist) {
        const mkdirp = require('mkdirp');
        const pathToCreate = filePath.split('/');
        pathToCreate.pop();
        mkdirp(pathToCreate.join('/'));
    }
    return doesExist;
}

function savePlayersScores(palyersScores) {
    if (!palyersScores || !palyersScores.length) {
        console.error('write empty array yourself');
        return;
    }
    createPathIfNeeded(CONST.PLAYERS_SCORES_FILE_PATH());
    const reducedObject = palyersScores.reduce((fileContents, ps) => {
        fileContents[ps._account_id] = {
            recentMatchesIds: ps.recentMatchesIds,
            nominations: ps.getNominations()
        };
        return fileContents;
    }, {});
    fs.writeFileSync(CONST.PLAYERS_SCORES_FILE_PATH(),
        JSON.stringify(reducedObject),
        'utf8',
        err => console.error('error writing palyersScores', err));
}

function readFileToObject(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8', err => console.error(err)));
}

function getPlayersScores() {
    if (!createPathIfNeeded(CONST.PLAYERS_SCORES_FILE_PATH())) {
        return [];
    }
    return readFileToObject(CONST.PLAYERS_SCORES_FILE_PATH());
}

function getPlayers() {
    return [];
}

function getPlayer() {
    return null;
}

function saveWinners(winners) {
    if (!winners || !winners.length) {
        console.error('write empty winners yourself');
        return;
    }
    createPathIfNeeded(CONST.WINNERS_FILE_PATH());
    fs.writeFileSync(CONST.WINNERS_FILE_PATH(),
        JSON.stringify({
            table: winners.map(wonNomination => {
                return {
                    account_id: wonNomination.account_id,
                    nominationName: wonNomination.nomination.getName(),
                    score: wonNomination.nomination.getScore()
                }
            })
        }),
        'utf8',
        err => console.error('error writing winners', err));
}

function getWinners() {
    if (!createPathIfNeeded(CONST.WINNERS_FILE_PATH())) {
        return { table: [] };
    }
    return readFileToObject(CONST.WINNERS_FILE_PATH());
}

module.exports = {
    savePlayersScores: savePlayersScores,
    getPlayersScores: getPlayersScores,
    getPlayer: getPlayer,
    getPlayers: getPlayers,
    saveWinners: saveWinners,
    getWinnersScore: getWinners
};