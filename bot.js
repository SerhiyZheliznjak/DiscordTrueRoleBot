const Discord = require("discord.js");
const authentication = require("./config/authentication.json");
const dotaApi = require("./dota-api/dota-api");
const Rx = require('rxjs');
const NominationService = require('./services/nomination-service');
const CONST = require('./constants');
const AwardService = require('./services/award-service');
const DataStore = require('./services/data-store');

const client = new Discord.Client();
let playersObserved = new Map();
let subscription;
let retardMap = new Map();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  CONST.setPlayersBeingObserved(playersObserved.length);
  const chanel = client.channels.find('type', 'text');
  forgiveRetards();
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
  if (isRetard(msg.author.id)) {
    msg.reply('АЛОАЛОАЛОАІОВЛОАЛДОІДАЛОІДАІЖДЛАОДЛОІДВЛОАЖІДВЛАОІВДАо!!! нічого не чую!!');
    return;
  }
  if (msg.content === 'restart' && msg.author.id === authentication.creatorId) {
    stopWatching();
    startWatching();
  }
  if (msg.content.toLowerCase().startsWith("watch")) {
    if (msg.mentions.users.array().length === 0) {
      msg.reply('Тобі показати як вставити своє ім\'я в повідомлення?');
      retardPlusPlus(msg);
    } else if (msg.mentions.users.array().length > 1) {
      msg.reply('Ти зовсім дурне? Як я маю всіх підряд зареєструвати?');
      retardPlusPlus(msg);
    } else if (msg.content.split(' ').filter(word => word !== '').length !== 3) {
      msg.reply('Курва... Шо ти пишеш?.. Має бути "watch @КОРИСТУВАЧ DOTA_ID"');
      retardPlusPlus(msg);
    } else {
      const r = / \d+/;
      DataStore.getPlayer(msg.content.match(r)[0].trim()).subscribe(playerInfo => {
        if (!!playerInfo) {
          playersObserved.set(playerInfo.account_id, msg.mentions.users.mentions);
        } else {

        }
      });
    }
    console.log(msg.content)
    console.dir(msg.mentions.users)
  }

  const playersObserved = [
    '298134653', '333303976', '118975931', '86848474', '314684987', '36753317'
  ];
});

function retardPlusPlus(message) {
  const authorId = message.author.id;
  if (!retardMap.get(authorId)) {
    console.log('initiated retard map')
    retardMap.set(authorId, []);
  }
  retardCount = retardMap.get(authorId);
  retardCount.push(new Date().getTime());
  if (retardCount.length > 3) {
    if (isRetard(authorId)) {
      message.reply('Я не пойму ніяк, ти розумововідсталий чи як? йди роздуплийсь трохи.');
    } else {
      retardCount.shift();
    }
  }
}

function isRetard(authorId) {
  if(retardMap.get(authorId)) {
    return retardCount.reduce((r, n) => n - r > r ? n - r : r) < 60*1000;
  }
  return false;
}

function forgiveRetards() {
  Rx.Observable.interval(1000 * 60 * 60 * 24).subscribe(() => retardMap = new Map());
}

client.login(authentication.testbot);