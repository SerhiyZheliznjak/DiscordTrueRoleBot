import { Message, Client, RichEmbed } from 'discord.js';
import { Subscription } from 'rxjs';
import DataStore from './DataStore';
import NominationService from './NominationService';
import NominationResult from '../model/NominationResult';
import { CommandsProcessor } from './CommandsProcessor';
import { CreatorCommand } from '../model/commands/CreatorCommand';
import { DiscordUtils } from '../utils/DiscordUtils';

export default class BotService {
    private claimedNominationsSubscription: Subscription;
    private chanel;
    private commandsProcessor: CommandsProcessor;

    constructor(
        private client: Client,
        private dataStore: DataStore = new DataStore(),
        private nominationService: NominationService = new NominationService()
    ) {
        this.chanel = this.client.channels.find('type', 'text');
        this.commandsProcessor = new CommandsProcessor(this.client, this.dataStore, this.nominationService);
        this.commandsProcessor.addCommand('restart', new CreatorCommand(this.client, this.dataStore, msg => this.restart(msg)));
    }

    public processMesage(msg: Message): void {
        this.commandsProcessor.onMessage(msg);
    }

    public startNominating() {
        this.dataStore.registeredPlayers.subscribe(playersMap => {
            this.claimedNominationsSubscription = this.nominationService.startNominating(playersMap)
                .subscribe((newNomintionsClaimed: NominationResult[]) => {
                    DiscordUtils.generateMessages(newNomintionsClaimed, this.dataStore).subscribe((richEmbed: RichEmbed) => {
                        this.chanel.send('', richEmbed);
                    });
                });
        });
    }

    private restart(msg: Message): void {
        this.stopNominating();
        this.startNominating();
    }

    private stopNominating(): void {
        this.nominationService.stopNominating();
        if (this.claimedNominationsSubscription) {
            this.claimedNominationsSubscription.unsubscribe();
        }
    }
}
