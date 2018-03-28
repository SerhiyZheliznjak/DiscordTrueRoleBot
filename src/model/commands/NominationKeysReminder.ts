import { CommandBase } from "../Command";
import { Message, Client } from "discord.js";
import DataStore from "../../services/DataStore";
import Nominations from "../Nominations";
import NominationResultJson from "../json/NominationResultJson";

export class NominationKeysReminder extends CommandBase {
    public process(msg: Message): void {
        this.dataStore.hallOfFame.subscribe((hallOfFame: Map<number, NominationResultJson>) => {
            let keys = '\n';
            const keyClassNameMap = Nominations.getKeyClassNameMap();
            for (const key of hallOfFame.keys()) {
                const className = keyClassNameMap.get(key);
                keys += className + ':\t' + hallOfFame.get(key).nominationName + '\n';
            }
            msg.reply(keys);
        });
    }
}
