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
        console.log('write empty array yourself');
        return;
    }
    createPathIfNeeded(CONST.PLAYERS_FILE_PATH());
    const reducedObject = palyersScores.reduce((fileContents, ps) => {
        fileContents[ps._account_id] = ps.getNominations();
        return fileContents;
    }, {});
    fs.writeFileSync(CONST.PLAYERS_FILE_PATH(),
        JSON.stringify(reducedObject),
        'utf8',
        err => console.log('error writing ', writeString, err));
}

function readFileToObject(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8', err => console.dir(err)));
}

function getPlayersScores() {
    if (!createPathIfNeeded(CONST.PLAYERS_FILE_PATH())) {
        return [];
    }
    return readFileToObject(CONST.PLAYERS_FILE_PATH());
}

module.exports = {
    savePlayersScores: savePlayersScores,
    getPlayersScores: getPlayersScores
};