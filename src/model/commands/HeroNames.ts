import { CommandBase } from "../Command";
import { Message } from "discord.js";
import { DiscordUtils } from "../../utils/DiscordUtils";

export class HeroNames extends CommandBase {
    public process(msg: Message): void {
        if (!this.isLocked(msg)) {
            this.dataStore.getHeroes().subscribe(heroesMap => {
                const heroNames = Array.from(heroesMap.keys()).sort().join('\n');
                msg.reply(DiscordUtils.formatAsBlock(heroNames));
            });
        }
    }

    public helpText(): string {
        return 'Повертає всі імена героїв, які можна використовувати для команди winrate';
    }
}
