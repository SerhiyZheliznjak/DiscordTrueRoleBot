const Discord = require("discord.js");
const authentication = require("./config/authentication.json");
const dotaApi = require("./dota-api/dota-api");
const Rx = require('rxjs');
const NominationService = require('./services/nomination-service');
const CONST = require('./constants');
const AwardService = require('./services/award-service');
const DataStore = require('./services/data-store');

const client = new Discord.Client();
let playersMap = new Map();
let subscription;
let retardMap = new Map();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  CONST.setPlayersBeingObserved(playersMap.size);
  
  forgiveRetards();
  // startWatching();
});

function startWatching() {
  const chanel = client.channels.find('type', 'text');
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

function showRegistered() {
  
}

client.on('message', msg => {
  if (isRetard(msg.author.id)) {
    const shutRetard = ['Стягнув', 'Ти такий розумний', 'Помовчи трохи', 'Т-с-с-с-с-с-с',
    'Біжи далеко', 'Ти можеш трохи тихо побути?', 'Ціхо', 'Каца!', 'Таааась тась тась', 'Люди, йдіть сі подивіть', 'Інколи краще жувати',
    'Ти то серйозно?', 'Молодець'];
    msg.reply(shutRetard[Math.floor(Math.random() * shutRetard.length)]);
    return;
  }
  if (msg.content === 'restart' && isCreator(msg)) {
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
          if(playersMap.get(playerInfo.account_id) && !isCreator(msg)) {
            msg.reply('Вже закріплено за @' + playersMap.get(playerInfo.account_id));
            retardPlusPlus(msg);
          } else {
            playersMap.set(playerInfo.account_id, msg.mentions.users.first().username);
            msg.reply('Я стежитему за тобою, ' + playerInfo.personaname);
          }
        } else {
          msg.reply('Давай ще раз, але цього разу очима дивись на айді гравця');
          retardPlusPlus(msg);
        }
      });
    }
  }
});

const regularplayers = [
  '298134653', '333303976', '118975931', '86848474', '314684987', '36753317'
];

function isCreator(msg) {
  return msg.author.id === authentication.creatorId;
}

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
      client.channels.find('type', 'text').send('@everyone Чат, небезпека - розумововідсталий!');
    } else {
      console.log('wtf?')
      retardCount.shift();
    }
  }
}

function isRetard(authorId) {
  if(retardMap.get(authorId) && retardMap.get(authorId).length > 3 && retardMap.get(authorId)) {
    return retardCount.reduce((r, c, i) => {
      const next = retardCount[i+1];
      if(next) {
        return r > next - c ? next - c : r;
      }
      return r;
    }) < 60*1000;
  }
  return false;
}

function forgiveRetards() {
  Rx.Observable.interval(1000 * 60 * 60 * 24).subscribe(() => retardMap = new Map());
}

client.login(authentication.testbot);