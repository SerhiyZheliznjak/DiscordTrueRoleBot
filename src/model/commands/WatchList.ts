import { CommandBase } from "../Command";
import { Message } from "discord.js";
import { DiscordUtils } from "../../utils/DiscordUtils";

export class WatchList extends CommandBase {
    public process(msg: Message): void {
        if (this.isCreator(msg)) {
            this.dataStore.registeredPlayers.subscribe(playersMap => {
                let registered = 'Стежу за: ';
                for (const info of playersMap) {
                    registered += info + '\n';
                }
                msg.reply(DiscordUtils.formatAsBlock(registered));
            });
        } else {
            this.retardPlusPlus(msg);
            msg.reply('хуйочліст');
        }
    }

    public helpText(): string {
        return 'то тільки для Творця';
    }
}
