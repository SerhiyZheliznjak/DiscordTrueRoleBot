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
let guild;

client.login(authentication.testbot);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  forgiveRetards();
  playersMap = regularPlayersMap;
  startWatching();
});

const regularPlayersMap = new Map();
regularPlayersMap.set('298134653', '407971834689093632');//Dno
regularPlayersMap.set('333303976', '407949091163865099');//Tee Hee
regularPlayersMap.set('118975931', '289388465034887178');//I'm 12 btw GG.BET
regularPlayersMap.set('86848474', '408363774257528852');//whoami
regularPlayersMap.set('314684987', '413792999030652938');//blackRose
regularPlayersMap.set('36753317', '408172132875501581');//=3

client.on('message', msg => {
  if (msg.author.bot) {
    return;
  }
  if (isRetard(msg.author.id)) {
    shutUpYouRRetard(msg);
    return;
  }
  if (msg.content.toLocaleLowerCase() === 'restart') {
    restart(msg);
  }
  if (msg.content.toLocaleLowerCase() === 'registerall') {
    registerall(msg);
  }
  if (msg.content.toLowerCase().startsWith("watch ")) {
    addWatch(msg);
  }
  if (msg.content.toLocaleLowerCase() === 'watchlist') {
    showRegistered(msg);
  }
});

function registerall(msg) {
  if (isCreator(msg)) {
    playersMap = regularPlayersMap;
  } else {
    retardPlusPlus(msg);
    msg.reply('хуєгістеролл');
  }
}

function restart(msg) {
  if (isCreator(msg)) {
    stopWatching();
    startWatching();
  } else {
    retardPlusPlus(msg);
    msg.reply('хуємпездрестарт');
  }
}

function shutUpYouRRetard(msg) {
  const shutRetard = ['Стягнув', 'Ти такий розумний', 'Помовчи трохи', 'Т-с-с-с-с-с-с',
    'Біжи далеко', 'Ти можеш трохи тихо побути?', 'Ціхо', 'Каца!', 'Таааась тась тась', 'Люди, йдіть сі подивіть', 'Інколи краще жувати',
    'Ти то серйозно?', 'Молодець'];
  msg.reply(shutRetard[Math.floor(Math.random() * shutRetard.length)]);
}

function showRegistered(msg) {
  if (isCreator(msg)) {
    let registered = 'Стежу за: ';
    for (let info of playersMap) {
      registered += info + '\n';
    }
    msg.reply(registered);
  } else {
    retardPlusPlus(msg);
    msg.reply('хуйочліст');
  }
}

function addWatch(msg) {
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
        if (playersMap.get(playerInfo.account_id) && !isCreator(msg)) {
          msg.reply('Вже закріплено за @' + playersMap.get(playerInfo.account_id));
          retardPlusPlus(msg);
        } else {
          playersMap.set(playerInfo.account_id, msg.mentions.users.first().id);
          msg.reply('Я стежитиму за тобою, ' + playerInfo.personaname);
        }
      } else {
        msg.reply('Давай ще раз, але цього разу очима дивись на айді гравця');
        retardPlusPlus(msg);
      }
    });
  }
}

function isCreator(msg) {
  return msg.author.id === authentication.creatorId;
}

function retardPlusPlus(msg) {
  const authorId = msg.author.id;
  if (!retardMap.get(authorId)) {
    retardMap.set(authorId, []);
  }
  retardCount = retardMap.get(authorId);
  retardCount.push(new Date().getTime());
  if (retardCount.length > 3) {
    if (isRetard(authorId)) {
      client.channels.find('type', 'text').send('@everyone Чат, небезпека - розумововідсталий!');
    } else {
      retardCount.shift();
    }
  }
}

function isRetard(authorId) {
  if (retardMap.get(authorId) && retardMap.get(authorId).length > 3 && retardMap.get(authorId)) {
    return retardCount.reduce((r, c, i) => {
      const next = retardCount[i + 1];
      if (next) {
        return r > next - c ? next - c : r;
      }
      return r;
    }) < 60 * 1000;
  }
  return false;
}

function forgiveRetards() {
  Rx.Observable.interval(1000 * 60 * 60 * 24).subscribe(() => retardMap = new Map());
}

function startWatching() {
  const chanel = client.channels.find('type', 'text');
  subscription = NominationService.observe(getDotaIds()).subscribe(playerScores => {
    const claimedNominations = AwardService.getNominationsWinners(playerScores);
    const prevWinnersScore = DataStore.getWinnersScore();
    console.dir(prevWinnersScore);
    const newWinners = claimedNominations.filter(cn => {
      const savedScore = prevWinnersScore.find(pws => cn.nomination.getName() === pws.nominationName);
      return !savedScore || cn.account_id === savedScore.account_id && cn.nomination.isMyScoreHigher(savedScore.score);
    });

    AwardService.generateMessages(newWinners).subscribe(message => {
      // console.dir(message);
      chanel.send('', getRichEmbed(message));
    });
    if (!!newWinners.length) {
      DataStore.saveWinnersScore(claimedNominations);
    }
    // const unclaimedNominations = AwardService.getUnclaimedNominations();
    // unclaimedNominations.forEach(unclaimed => {
    //   const existingRole = getRole(unclaimed.nomination.getName());
    //   if (existingRole) {
    //     const previousHolder = existingRole.members.first();
    //     if (previousHolder) {
    //       previousHolder.removeRole(existingRole);
    //     }
    //   }
    // });
  });
}

function getDotaIds() {
  let dotaIds = [];
  for (let id of playersMap.keys()) {
    dotaIds.push(id);
  }
  return dotaIds;
}

function stopWatching() {
  NominationService.stop();
  if (subscription) {
    subscription.unsubscribe();
  }
}

function getRichEmbed(winnerMessage) {
  const richEmbed = new Discord.RichEmbed();
  richEmbed.setTitle(winnerMessage.title);
  richEmbed.setDescription(winnerMessage.description);
  richEmbed.setImage(winnerMessage.avatarUrl);
  richEmbed.setFooter(winnerMessage.footer);
  return richEmbed;
}

// function createRole(roleName) {
//   return Rx.Observable.fromPromise(getGuild().createRole({
//     name: roleName,
//     color: '#' + Math.floor(Math.random() * 16777215).toString(16)
//   }));
// }

// function getRole(name) {
//   return getGuild().roles.find('name', name);
// }

// function getGuild() {
//   if (!guild) {
//     guild = client.guilds.first();
//   }
//   return guild;
// }

// function assignRole(claimedNomination) {
//   const roleName = claimedNomination.nomination.getName();
//   const existingRole = getRole(roleName);
//   if (existingRole) {
//     const previousHolder = existingRole.members.first();
//     if (previousHolder) {
//       if (previousHolder.id !== claimedNomination.account_id) {
//         previousHolder.removeRole(existingRole);
//         assignRoleToMember(existingRole, claimedNomination.account_id);
//         console.log('reassigned existing ' + roleName);
//         return true;
//       } else {
//         console.log('skipped as ' + roleName + ' is already assigned to winner');

//         return false;
//       }
//     } else {
//       console.log('failed to find ' + roleName + ' holder assigned to new one');
//       assignRoleToMember(existingRole, claimedNomination.account_id);
//       return true;
//     }
//   } else {
//     createRole(roleName).subscribe(role => {
//       assignRoleToMember(role, claimedNomination.account_id);
//     });
//     console.log('crated new ' + roleName + ' and assigned');
//     return true;
//   }
// }

// function assignRoleToMember(role, account_id) {
//   const member = getGuild().members.find('id', playersMap.get(account_id));
//   if (member) {
//     member.addRole(role);
//   } else {
//     console.log('failed to find member to assign' + role);
//   }
// }
