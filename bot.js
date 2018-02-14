const Discord = require("discord.js");
const authentication = require("./config/authentication.json");
const dotaApi = require("./dota-api/dota-api");
const Rx = require('rxjs');
const NominationService = require('./services/nomination-service');
const CONST = require('./constants');
const NominationList = require('./model/NominationsList');

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const playersObserved = [
    '298134653', '333303976', '118975931', '86848474', '314684987', '36753317'
  ];
  CONST.setPlayersBeingObserved(playersObserved.length);
  NominationService.observe(playersObserved).subscribe(playerScores => {
    if(playerScores.find(ps=>ps.hasNewMatches)) {
      NominationList.create().forEach((nomination, index) => {
        const nominationWithPlayersResults = playerScores.map(ps => {
          const n = ps.getNominations()[index];//night not work though why it wouldn't?
          return {
            account_id: ps.getAccountId(),
            nomination_name: n.getName(),
            score: n.getScore()
          };
        });
        const winner = nominationWithPlayersResults.reduce((winner, nwp) => {
          return nwp.score > winner.score ? nwp : winner;
        });
        console.log(nomination.getName(), ' winner is ', winner);
      });
    }
  });
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

client.login(authentication.token);