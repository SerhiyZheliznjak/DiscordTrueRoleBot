const Discord = require("discord.js");
const authentication = require("./config/authentication.json");
const dotaApi = require("./dota-api/dota-api");
const Rx = require('rxjs');
const NominationService = require('./services/nomination-service');
const CONST = require('./constants');

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const playersObserved = [
    '118778147', '62484741', '298134653'
  ];
  CONST.setPlayersBeingObserved(playersObserved.length);
  // ['118778147']
  NominationService.observe(playersObserved).subscribe(winners => console.dir(winners));
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

client.login(authentication.token);