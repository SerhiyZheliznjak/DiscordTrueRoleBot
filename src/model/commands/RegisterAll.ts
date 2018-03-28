import { CommandBase } from "../Command";
import DataStore from "../../services/DataStore";
import { Client, Message } from "discord.js";
import Pair from "../Pair";

export class RegisterAll extends CommandBase {
    public process(msg: Message): void {
        if (!this.isCreator(msg)) {
            this.retardPlusPlus(msg);
            msg.reply('хуєгістеролл');
        } else {
            this.dataStore.registeredPlayers.subscribe(playersMap => {
                const myFriends = [
                    new Pair(298134653, '407971834689093632'), // Dno
                    new Pair(333303976, '407949091163865099'), // Tee Hee
                    new Pair(118975931, '289388465034887178'), // I'm 12 btw GG.BET
                    new Pair(86848474, '408363774257528852'), // whoami
                    new Pair(314684987, '413792999030652938'), // Малий Аднрюхи (Денис)
                    new Pair(36753317, '408172132875501581'), // =3
                ];
                myFriends.forEach(friend => {
                   if (!playersMap.get(friend.p1)) {
                    this.dataStore.registerPlayer(friend.p1, friend.p2);
                   }
                });
                msg.reply('зроблено, але ліпше перевір БД');
            });
        }
    }
}
