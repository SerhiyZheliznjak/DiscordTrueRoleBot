const Rx = require('rxjs');
const fs = require('fs');
const CONST = require('../constants');

function saveToFile(dataToWrite, filePath, identify) {
    if (!dataToWrite || !dataToWrite.length) {
        console.log('write empty array yourself');
        return;
    }
    const rfObservable = Rx.Observable.bindCallback(fs.readFile);

    exists(filePath);
    rfObservable(filePath).subscribe(updateFileData);

    function updateFileData(err, fileContents) {
        fileContents = !err ? JSON.parse(fileContents) : { table: [] };
        fileContents.table = fileContents.table.filter(fc => !dataToWrite.find(dtw => identify(fc) === identify(dtw)));
        fileContents.table.push(...dataToWrite);
        while (fileContents.table.length > CONST.GetMaxMatches()) {
            fileContents.table.shift();
        }
        const writeString = JSON.stringify(fileContents);
        fs.writeFile(filePath, writeString, 'utf8', err => !!err ? console.log('error writing ', writeString, err) : console.log('Saved successfully'));
    }
}

function exists(filePath) {
    const doesExist = fs.existsSync(filePath);
    if (!doesExist) {
        const mkdirp = require('mkdirp');
        const pathToCreate = filePath.split('/');
        pathToCreate.pop();
        mkdirp(pathToCreate.join('/'));
    }
    return doesExist;
}

function saveMatches(matches) {
    saveToFile(matches, CONST.MATCHES_FILE_PATH(), m => m.match_id);
}

function savePlayersScores(palyersScores) {
    saveToFile(palyersScores, CONST.PLAYERS_FILE_PATH(), p => p.account_id);
}

function readFileToObject(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8', err => console.dir(err)));
}

function getPlayerScore() {
    if (!exists(CONST.PLAYERS_FILE_PATH())) {
        return [];
    }
    return readFileToObject(CONST.PLAYERS_FILE_PATH()).table;
}

function getMatches() {
    if (!exists(CONST.MATCHES_FILE_PATH())) {
        return [];
    }
    return readFileToObject(CONST.MATCHES_FILE_PATH()).table;
}

module.exports = {
    saveMatches: saveMatches,
    savePlayersScores: savePlayersScores,
    getPlayerScore: getPlayerScore,
    getMatches: getMatches
};