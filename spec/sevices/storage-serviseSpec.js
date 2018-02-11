const storageService = require('../../services/storage-service');
const fs = require('fs');
const constants = require('../../constants');
const testMatch = require('../helpers/FullMatchData.json');
let matchesBackup;

beforeAll(() => {
    if(fs.existsSync(constants.MATCHES_PATH())) {
        matchesBackup = JSON.parse(fs.readFileSync(constants.MATCHES_PATH(), 'utf8'));
    }    
});

afterAll(() => {
    if(!!matchesBackup) {
        console.log(matchesBackup);
        fs.writeFile(constants.MATCHES_PATH(), JSON.stringify(matchesBackup), 'utf8');
    }
});

function getMatches() {
    return JSON.parse(fs.readFileSync(constants.MATCHES_PATH(), 'utf8'));
}

describe('Storage service', () => {
    it('should save match', () => {
        storageService.saveMatch(testMatch);
    });
});