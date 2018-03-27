import { CommandBase } from "../model/Command";
import { ShowTop } from "../model/commands/ShowTop";
import { Client, Message } from "discord.js";
import { Register } from "../model/commands/Register";
import { Observable } from "rxjs";
import Constants from "../Constants";

export class CommandsProcessor extends CommandBase {
    private commandMap = new Map<string, CommandBase>();

    public getCommandParser(msg: Message): CommandBase {
        if (this.commandMap.size === 0) {
            this.init();
        }
        return this.commandMap.get(this.parseCommandName(msg.content));
    }

    public onMessage(msg: Message): void {
        if (this.isBot(msg)) {
            return;
        }
        if (this.isRetard(msg.author.id)) {
            this.shutUpYouRRetard(msg);
            return;
        }
        const command = this.getCommandParser(msg);
        if (command) {
            command.process(msg);
        }
    }

    public process(msg: Message): void {
        const commands =  [...this.commandMap].map(p => p[0]).sort().join('\n');
        msg.reply(commands);
    }

    public forgiveRetards(): void {
        Observable.interval(Constants.FORGIVE_RETARDS_INTERVAL).subscribe(() => CommandBase.retardMap = new Map());
    }

    private isBot(message: Message): boolean {
        return message.author.bot;
    }

    private parseCommandName(content: string): string {
        return content.split(' ')[0].substring(1).toLowerCase();
    }

    private init(): void {
        this.commandMap.set('register', new Register(this.client));
        this.commandMap.set('top', new ShowTop(this.client));
        this.commandMap.set('commands', this);
    }
}
