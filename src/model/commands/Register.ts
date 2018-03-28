import { CommandBase } from "../Command";
import { Message, Client } from "discord.js";
import DataStore from "../../services/DataStore";

export class Register extends CommandBase {
    public process(msg: Message): void {
        if (msg.mentions.users.array().length === 0) {
            msg.reply('Тобі показати як вставити своє ім\'я в повідомлення?');
            this.retardPlusPlus(msg);
        } else if (msg.mentions.users.array().length > 1) {
            msg.reply('Ти зовсім дурне? Як я маю всіх підряд зареєструвати?');
            this.retardPlusPlus(msg);
        } else if (msg.content.split(' ').filter(word => word !== '').length !== 3) {
            msg.reply('Курва... Шо ти пишеш?.. Має бути "watch @КОРИСТУВАЧ DOTA_ID"');
            this.retardPlusPlus(msg);
        } else {
            this.dataStore.getProfile(parseInt(msg.content.match(/ \d+/)[0].trim())).subscribe(playerInfo => {
                if (!!playerInfo) {
                    this.dataStore.registeredPlayers.subscribe(playersMap => {
                        if (playersMap.get(playerInfo.account_id) && !this.isCreator(msg)) {
                            msg.reply('Вже закріплено за @' + playersMap.get(playerInfo.account_id));
                            this.retardPlusPlus(msg);
                        } else {
                            this.dataStore.registerPlayer(playerInfo.account_id, msg.mentions.users.first().id);
                            msg.reply('Я стежитиму за тобою, ' + playerInfo.personaname);
                        }
                    });
                } else {
                    msg.reply('Давай ще раз, але цього разу очима дивись на айді гравця');
                    this.retardPlusPlus(msg);
                }
            });
        }
    }
}
