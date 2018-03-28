import { CommandBase } from "../Command";
import DataStore from "../../services/DataStore";
import { Client, Message } from "discord.js";

export class WatchList extends CommandBase {
    public process(msg: Message): void {
        if (this.isCreator(msg)) {
            this.dataStore.registeredPlayers.subscribe(playersMap => {
                let registered = 'Стежу за: ';
                for (const info of playersMap) {
                    registered += info + '\n';
                }
                msg.reply(registered);
            });
        } else {
            this.retardPlusPlus(msg);
            msg.reply('хуйочліст');
        }
    }
}
