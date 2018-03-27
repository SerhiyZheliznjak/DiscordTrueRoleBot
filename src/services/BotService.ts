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
        this.commandsProcessor = new CommandsProcessor(this.client);
    }

    public processMesage(msg: Message): void {
        this.commandsProcessor.process(msg);
        if (msg.content.toLocaleLowerCase() === 'registerall') {
            this.registerall(msg);
        }

        if (msg.content.toLocaleLowerCase() === 'watchlist') {
            this.showRegistered(msg);
        }
        if (msg.content.toLowerCase().startsWith('нагадай ключі')) {
            this.showNominationKeys(msg);
        }
        if (msg.content.toLowerCase().startsWith('хто топ ')) {
            this.getTopN(msg);
        }
    }

    public startNominating() {
        this.dataStore.registeredPlayers.subscribe(playersMap => {
            this.claimedNominationsSubscription = this.nominationService.startNominating(playersMap)
                .subscribe((newNomintionsClaimed: NominationResult[]) => {
                    this.generateMessages(newNomintionsClaimed).subscribe((richEmbed: RichEmbed) => {
                        this.chanel.send('', richEmbed);
                    });
                });
        });
    }

    private registerCommand(): void {

    }

    private registerall(msg: Message): void {
        if (!this.isCreator(msg)) {
            this.retardPlusPlus(msg);
            msg.reply('хуєгістеролл');
        } else {
            this.dataStore.registeredPlayers.subscribe(playersMap => {
                if (playersMap.size === 0) {
                    this.dataStore.registerPlayer(298134653, '407971834689093632'); // Dno
                    this.dataStore.registerPlayer(333303976, '407949091163865099'); // Tee Hee
                    this.dataStore.registerPlayer(118975931, '289388465034887178'); // I'm 12 btw GG.BET
                    this.dataStore.registerPlayer(86848474, '408363774257528852'); // whoami
                    this.dataStore.registerPlayer(314684987, '413792999030652938'); // Малий Аднрюхи (Денис)
                    this.dataStore.registerPlayer(36753317, '408172132875501581'); // =3
                }
            });
        }
    }

    private restart(msg: Message): void {
        if (this.isCreator(msg)) {
            this.stopNominating();
            this.startNominating();
        } else {
            this.retardPlusPlus(msg);
            msg.reply('хуємпездрестарт');
        }
    }

    private showRegistered(msg: Message): void {
        if (this.isCreator(msg)) {
            this.dataStore.registeredPlayers.subscribe(playersMap => {
                let registered = 'Стежу за: ';
                for (const info of playersMap) {
                    registered += info + '\n';
                }
                msg.reply(registered);
            });
        } else {
            this.retardPlusPlus(msg);
            msg.reply('хуйочліст');
        }
    }

    private stopNominating(): void {
        this.nominationService.stopNominating();
        if (this.claimedNominationsSubscription) {
            this.claimedNominationsSubscription.unsubscribe();
        }
    }

    private getRichEmbed(title: string, description: string, avatarUrl?: string, footer?: string, url?: string): RichEmbed {
        const richEmbed = new RichEmbed();
        richEmbed.setTitle(title);
        richEmbed.setDescription(description);
        richEmbed.setThumbnail(avatarUrl);
        richEmbed.setFooter(footer);
        if (url) {
            richEmbed.setURL(url);
        }
        return richEmbed;
    }

    private generateMessages(claimedNominations: NominationResult[]): Observable<RichEmbed> {
        return Observable.from(claimedNominations)
            .flatMap(cn => this.getNominationWithPlayerProfile(cn))
            .map(pair => this.getRichEmbed(
                pair.p2.personaname + ': ' + pair.p1.nomination.getName(),
                pair.p1.nomination.getMessage(),
                pair.p2.avatarmedium,
                pair.p1.nomination.getScoreText(),
                pair.p2.profileurl
            ));
    }

    private getNominationWithPlayerProfile(claimedNomination: NominationResult): Observable<Pair<NominationResult, ProfileJson>> {
        return this.dataStore.getProfile(claimedNomination.account_id).map(profile => new Pair(claimedNomination, profile));
    }

    private showNominationKeys(msg: Message): void {
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

    private getTopN(msg: Message): void {
        
    }


}
