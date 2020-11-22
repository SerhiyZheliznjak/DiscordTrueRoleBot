import { CommandBase } from "../model/Command";
import { ShowTop } from "../model/commands/ShowTop";
import { Client, Message } from "discord.js";
import { Register } from "../model/commands/Register";
import { Observable } from "rxjs";
import Constants from "../Constants";
// import DataStore from "./DataStore";
import { RegisterAll } from "../model/commands/RegisterAll";
import { WatchList } from "../model/commands/WatchList";
import { NominationKeysReminder } from "../model/commands/NominationKeysReminder";
import NominationService from "./NominationService";
import { DiscordUtils } from "../utils/DiscordUtils";
import { WinRate } from "../model/commands/WinRateCommand";
import { HeroNames } from "../model/commands/HeroNames";
import { TopTeams } from "../model/commands/TopTeams";

export class CommandsProcessor extends CommandBase {
    private commandMap = new Map<string, CommandBase>();

    //constructor(client: Client, dataStore: DataStore, private nominationService: NominationService) {
    //    super(client, dataStore);
    //    this.init();
    //}
    
     constructor(client: Client, private nominationService: NominationService) {
        super(client);
        this.init();
    }

    public addCommand(command: string, processor: CommandBase): void {
        this.commandMap.set(command, processor);
    }

    public getCommandParser(msg: Message): CommandBase {
        const commandName = this.parseCommandName(msg.content);
        return this.commandMap.get(commandName);
    }

    public onMessage(msg: Message): void {
        if (this.isBot(msg)) {
            return;
        }
        if (this.isRetard(msg.author.id)) {
            this.shutUpYouRRetard(msg);
            return;
        }
        const processor = this.getCommandParser(msg);
        if (processor) {
            processor.process(msg);
        }
    }

    public process(msg: Message): void {
        const commands =  [...this.commandMap].map(p => p[0] + ' - ' + p[1].helpText()).sort().join('\n\n');
        msg.reply(DiscordUtils.formatAsBlock(commands));
    }

    public helpText(): string {
        return 'повертає перелік усіх доступних команд';
    }

    public forgiveRetards(): void {
        Observable.interval(Constants.FORGIVE_RETARDS_INTERVAL).subscribe(() => CommandBase.retardMap = new Map());
    }

    private isBot(message: Message): boolean {
        return message.author.bot;
    }

    private parseCommandName(content: string): string {
        return content.split(' ')[0].toLowerCase();
    }

    private init(): void {
        this.commandMap.set('register', new Register(this.client, this.dataStore));
        this.commandMap.set('top', new ShowTop(this.client, this.dataStore, this.nominationService));
        this.commandMap.set('commands', this);
        this.commandMap.set('registerall', new RegisterAll(this.client, this.dataStore));
        this.commandMap.set('watchlist', new WatchList(this.client, this.dataStore));
        this.commandMap.set('nominationkeys', new NominationKeysReminder(this.client, this.dataStore));
        this.commandMap.set('winrate', new WinRate(this.client, this.dataStore));
        this.commandMap.set('heronames', new HeroNames(this.client, this.dataStore));
        this.commandMap.set('topteams', new TopTeams(this.client, this.dataStore));
        this.forgiveRetards();
    }
}
