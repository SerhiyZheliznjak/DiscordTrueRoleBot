const fs = require('fs');
const constants = require('constants');

function saveMatch(match) {
    fs.readFile(constants.MATCHES_PATH(), 'utf8', function readFileCallback(err, data) {
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

function getPlayers() {
    return players;
}


function getMatches() {
    return matches;
}

function saveRecentPlayerMatches(player_id, matches) {

}

module.exports = {
    saveMatch: saveMatch,
    saveRecentPlayerMatches: saveRecentPlayerMatches,
    getPlayers: getPlayers,
    getMatches: getMatches
};