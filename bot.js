const Discord = require("discord.js");
const authentication = require("./config/authentication.json");
const dotaApi = require("./dota-api/dota-api");
const Rx = require('rxjs');
const NominationService = require('./services/nomination-service');
const CONST = require('./constants');
const AwardService = require('./services/award-service');

const client = new Discord.Client();
let playersObserved = new Map();
let subscription;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  CONST.setPlayersBeingObserved(playersObserved.length);
  const chanel = client.channels.find('type', 'text');
  // startWatching();
});

function startWatching() {
  subscription = NominationService.observe([
    '298134653', '333303976', '118975931', '86848474', '314684987', '36753317'
  ]).subscribe(playerScores => {
   const claimedNominations = AwardService.getNominationsWinners(playerScores);
   AwardService.generateMessages(claimedNominations).subscribe(message => chanel.send('', getRichEmbed(message)));
  });
}

function stopWatching() {
  NominationService.stop();
  subscription.unsubscribe();
}

function getRichEmbed(winnerMessage) {
  const richEmbed = new Discord.RichEmbed();
  richEmbed.setTitle(winnerMessage.title);
  richEmbed.setDescription(winnerMessage.description);
  richEmbed.setImage(winnerMessage.avatarUrl);
  richEmbed.setFooter(winnerMessage.footer);
  return richEmbed;
}

client.on('message', msg => {
  if (msg.content === 'restart' && msg.author.id === authentication.creatorId) {
    stopWatching();
    startWatching();
  }
  if (msg.content.toLowerCase().startsWith("watch")) {
    if(msg.mentions.users.array.length === 0) {
      msg.reply('Тобі показати як вставити своє ім\'я в повідомлення?');
    } else if (msg.mentions.users.array.length > 1) {
      msg.reply('Ти зовсім дурне? Як я маю всіх підряд зареєструвати?');
    } else if (msg.content.split(' ').filter(word=>word!== '').length !== 3) {
      msg.reply('Курва, та шо ти пишеш? Має бути watch');
    }
    console.log(msg.content)
    console.dir(msg.mentions.users)
  }
  const playersObserved = [
    '298134653', '333303976', '118975931', '86848474', '314684987', '36753317'
  ];
});

client.login(authentication.testbot);