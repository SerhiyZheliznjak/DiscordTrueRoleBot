const Rx = require('rxjs');
const fs = require('fs');
const CONST = require('../constants');

function saveToFile(data, filePath, identify) {
    const rfObservable = Rx.Observable.bindCallback(fs.readFile);
    const eObservable = Rx.Observable.bindCallback(fs.exists);
    eObservable(filePath).subscribe(
        exists => {
            if (!exists) {
                const mkdirp = require('mkdirp');
                const pathToCreate = filePath.split('/');
                pathToCreate.pop();
                mkdirp(pathToCreate.join('/'));
            }
            rfObservable(filePath).subscribe(updateFileData);
        }
    );

    function updateFileData(err, newData) {
        if (err) {
            data = { table: [] };
        } else {
            data = JSON.parse(newData);
        }
        const exists = data.table.find(m => identify(newData) === identify(match_id));
        if (!exists) {
            data.table.push(newData);
            if (data.length > 80) {
                data.pop();
            }
        } else {
            for(let p in exists) {
                if(exists.hasOwnProperty(p)) {
                    exists[p] = newData[p];
                }
            }
        }
        fs.writeFile(filePath, JSON.stringify(data), 'utf8', err => console.log(err));
    }
}

function saveMatch(match) {
    saveToFile(match, CONST.MATCHES_FILE_PATH(), m => m.match_id);
}

function savePlayerScore(palyerScore) {
    saveToFile(palyerScore, CONST.PLAYERS_FILE_PATH(), p => p.account_id);
}

function readFileToObject(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8', err=>console.dir(err)));
}

function getPlayerScore() {
    return readFileToObject(CONST.PLAYERS_FILE_PATH()).table;
}

function getMatches() {
    return readFileToObject(CONST.MATCHES_FILE_PATH()).table;
}

module.exports = {
    saveMatch: saveMatch,
    savePlayerScore: savePlayerScore,
    getPlayerScore: getPlayerScore,
    getMatches: getMatches
};