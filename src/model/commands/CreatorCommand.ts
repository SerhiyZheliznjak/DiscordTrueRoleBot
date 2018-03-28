import { CommandBase } from "../Command";
import { Message, Client } from "discord.js";
import { Observable } from "rxjs";
import NominationService from "../../services/NominationService";
import DataStore from "../../services/DataStore";
import { ProfileJson } from "../../dota-api/DotaJsonTypings";
import NominationResult from "../NominationResult";

export class CreatorCommand extends CommandBase {
    constructor(
        client: Client,
        dataStore: DataStore,
        private processCb: (msg: Message) => void
    ) {
        super(client, dataStore);
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
