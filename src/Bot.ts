import {Client} from 'discord.js';
const Auth = require('../config/auth.json');

import { BotService } from './services/BotService';

const client: Client = new Client();
let botService: BotService;

client.login(Auth.testbot);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  botService  = new BotService(client);
  botService.forgiveRetards();
  botService.startWatching();
});

client.on('message', msg => {
  botService.processMesage(msg);
});
