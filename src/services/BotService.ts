import { Message, Client, RichEmbed } from 'discord.js';
import { Observable, Subscription, Observer } from 'rxjs';
import DataStore from './DataStore';
import NominationService from './NominationService';
import { ProfileJson } from '../dota-api/DotaJsonTypings';
import NominationResult from '../model/NominationResult';
import StorageService from './StorageService';
import Constants from '../Constants';
import Pair from '../model/Pair';
import NominationResultJson from '../model/json/NominationResultJson';
import Nominations from '../model/Nominations';
import Nomination from '../model/Nomination';
import { CommandBase } from '../model/Command';
import { ShowTop } from '../model/commands/ShowTop';
import { CommandsProcessor } from './CommandsProcessor';
import { CreatorCommand } from '../model/commands/CreatorCommand';
import { DiscordUtils } from '../utils/DiscordUtils';

export default class BotService {
    private nominationKeysMap: Map<string, string>;
    private claimedNominationsSubscription: Subscription;
    private chanel;
    private processors: Map<string, CommandBase>;
    private commandsProcessor: CommandsProcessor;

    constructor(
        private client: Client,
        private dataStore: DataStore = new DataStore(),
        private nominationService: NominationService = new NominationService(),
        private storageService: StorageService = new StorageService()
    ) {
        this.chanel = this.client.channels.find('type', 'text');
        this.nominationKeysMap = Nominations.all.reduce((map: Map<string, string>, nomination: Nomination) => {
            map.set(nomination.constructor.name.toLowerCase(), nomination.getName());
            return map;
        }, new Map());
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
