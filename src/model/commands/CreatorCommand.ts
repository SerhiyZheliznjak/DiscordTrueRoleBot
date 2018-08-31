import { CommandBase } from "../Command";
import { Message, Client } from "discord.js";
import DataStore from "../../services/DataStore";

export class CreatorCommand extends CommandBase {
    constructor(
        client: Client,
        dataStore: DataStore,
        private processCb: (msg: Message) => void
    ) {
        super(client, dataStore);
    }

    public helpText(): string {
        return 'то щоб Творець міг перезапустити';
    }

    public process(msg: Message): void {
        if (this.isCreator(msg)) {
            this.processCb(msg);
        } else {
            this.retardPlusPlus(msg);
            msg.reply('ти того бота писав щоб таке з ним робити?');
        }
    }

    private parseTopNMessage(msg: Message): string[] {
        const arr = msg.content.toLowerCase().split(' ');
        if (arr.length === 3 || arr.length === 4) {
            return arr;
        } else {
            this.retardPlusPlus(msg);
        }
        return [];
    }
}
