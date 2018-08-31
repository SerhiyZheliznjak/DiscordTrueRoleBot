import { Client } from 'discord.js';
import BotService from './services/BotService';

const client: Client = new Client();
let botService: BotService;

client.login(process.env.token);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  botService = new BotService(client);
  botService.startNominating();
});

client.on('message', msg => {
  botService.processMesage(msg);
});
