import { CommandBase } from "../Command";
import { Message } from "discord.js";

export class RegisterAll extends CommandBase {
    public process(msg: Message): void {
        if (!this.isCreator(msg)) {
            this.retardPlusPlus(msg);
            msg.reply('хуєгістеролл');
        } else {
            this.dataStore.registeredPlayers.subscribe(playersMap => {
                const myFriends: Array<[number, string]> = [
                    [298134653, '407971834689093632'], // Dno
                    [333303976, '407949091163865099'], // Tee Hee
                    [118975931, '289388465034887178'], // I'm 12 btw GG.BET
                    [86848474, '408363774257528852'], // whoami
                    [314684987, '235372240160423936'], // Малий Аднрюхи (Денис)
                    [36753317, '408172132875501581'], // =3
                ];
                myFriends.forEach(friend => {
                   if (!playersMap.get(friend[0])) {
                    this.dataStore.registerPlayer(friend[0], friend[1]);
                   }
                });
                msg.reply('зроблено, але ліпше перевір БД');
            });
        }
    }

    public helpText(): string {
        return 'то тільки для Творця';
    }
}
