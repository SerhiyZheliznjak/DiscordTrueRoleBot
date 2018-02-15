const Discord = require("discord.js");
const authentication = require("./config/authentication.json");
const dotaApi = require("./dota-api/dota-api");
const Rx = require('rxjs');
const NominationService = require('./services/nomination-service');
const CONST = require('./constants');
const AwardService = require('./services/award-service');

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const playersObserved = [
    '298134653', '333303976', '118975931', '86848474', '314684987', '36753317'
  ];
  CONST.setPlayersBeingObserved(playersObserved.length);
  client.user.send('Hi Creator!');
  // NominationService.observe(playersObserved).subscribe(playerScores => {
  //  const claimedNominations = AwardService.getNominationsWinners(playerScores);
  //  AwardService.generateMessages(claimedNominations).subscribe(message => Discord.post(message.title, message.description, message.profileUrl, message.avatarUrl));
  // });
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

client.login(authentication.testbot);


// let title = util.format("%s %s his last game", p.profile.personaname, ((m.player_slot < 128 && m.radiant_win) || (m.player_slot >= 128 && !m.radiant_win)) ? "WON" : "LOST");
// let description = util.format("Hero: %s\nKDA: %s/%s/%s\n\nGame mode: %s, %s\n\nIt started at %s and lasted %s minutes",
//     enums.HEROES.find(h => h.id == m.hero_id).localized_name,
//     m.kills, m.deaths, m.assists,
//     enums.LOBBIES.find(l => l.id == m.lobby_type).name,
//     enums.MODES.find(mode => mode.id == m.game_mode).name,
//     new Date(m.start_time * 1000).toLocaleTimeString(), parseInt(m.duration / 60)
// );
// let url = util.format("https://www.dotabuff.com/matches/%s", m.match_id)
// discord.post(title, description, url, p.profile.avatarmedium);