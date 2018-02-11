const fs = require('fs');
const constants = require('../constants');

function saveMatch(match) {
    fs.readFile(constants.MATCHES_PATH(), 'utf8', (err, data) => {        
        let matches;
        if (err) {
            if (err.errno === -4058) {
                fs.mkdirSync(constants.MATCHES_PATH().replace('/matches.json', ''));
                matches = { table: [] };
            }
        } else {
            matches = JSON.parse(data);
        }
        const exists = matches.table.find(m => match.match_id === m.match_id);
        if (!exists) {
            matches.table.push(match);
            if (matches.length > 80) {
                matches.pop();
            }
            const json = JSON.stringify(matches);
            fs.writeFile(constants.MATCHES_PATH(), json, 'utf8');
        }
    });
}

function getPlayerScore() {
    return JSON.parse(fs.readFileSync(constants.PLAYERS_PATH(), 'utf8'));
}


function getMatches() {
    return JSON.parse(fs.readFileSync(constants.MATCHES_PATH(), 'utf8'));
}

function savePlayerScore(player_id, matches) {
    fs.readFile(constants.MATCHES_PATH(), 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const matches = JSON.parse(data);
            const exists = obj.table.find(m => match.match_id === m.match_id);
            if (!exists) {
                matches.table.push(match);
                if (matches.length > 80) {
                    matches.pop();
                }
                const json = JSON.stringify(matches); //convert it back to json
                fs.writeFile(constants.MATCHES_PATH(), json, 'utf8'); // write it back 
            }

        }
    });
}

module.exports = {
    saveMatch: saveMatch,
    savePlayerScore: savePlayerScore,
    getPlayerScore: getPlayerScore,
    getMatches: getMatches
};