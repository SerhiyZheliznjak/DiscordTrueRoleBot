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

export default class BotService {
    private retardMap = new Map();
    private nominationKeysMap: Map<string, string>;
    private claimedNominationsSubscription: Subscription;
    private chanel;

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
    }

    public processMesage(msg: Message): void {
        if (msg.author.bot) {
            return;
        }
        if (this.isRetard(msg.author.id)) {
            this.shutUpYouRRetard(msg);
            return;
        }
        if (msg.content.toLocaleLowerCase() === 'restart') {
            this.restart(msg);
        }
        if (msg.content.toLocaleLowerCase() === 'registerall') {
            this.registerall(msg);
        }
        if (msg.content.toLowerCase().startsWith('watch')) {
            this.addWatch(msg);
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

    public forgiveRetards(): void {
        Observable.interval(Constants.FORGIVE_RETARDS_INTERVAL).subscribe(() => this.retardMap = new Map());
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

    private isRetard(authorId: string): boolean {
        const retardCount = this.retardMap.get(authorId);
        if (retardCount && retardCount.length > 3 && retardCount) {
            return retardCount.reduce((r, c, i) => {
                const next = retardCount[i + 1];
                if (next) {
                    return r > next - c ? next - c : r;
                }
                return r;
            }) < 60 * 1000;
        }
        return false;
    }

    private retardPlusPlus(msg: Message): void {
        const authorId = msg.author.id;
        if (!this.retardMap.get(authorId)) {
            this.retardMap.set(authorId, []);
        }
        const retardCount = this.retardMap.get(authorId);
        retardCount.push(new Date().getTime());
        if (retardCount.length > 3) {
            if (this.isRetard(authorId)) {
                (this.client.channels.find('type', 'text') as any).send('@everyone Чат, небезпека - розумововідсталий!');
            } else {
                retardCount.shift();
            }
        }
        console.log('retard++');
    }

    private shutUpYouRRetard(msg: Message): void {
        const shutRetard = ['Стягнув', 'Ти такий розумний', 'Помовчи трохи', 'Т-с-с-с-с-с-с',
            'Біжи далеко', 'Ти можеш трохи тихо побути?', 'Ціхо', 'Каца!', 'Таааась тась тась',
            'Люди, йдіть сі подивіть', 'Інколи краще жувати', 'Ти то серйозно?', 'Молодець'];
        msg.reply(shutRetard[Math.floor(Math.random() * shutRetard.length)]);
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

    private addWatch(msg: Message): void {
        if (msg.mentions.users.array().length === 0) {
            msg.reply('Тобі показати як вставити своє ім\'я в повідомлення?');
            this.retardPlusPlus(msg);
        } else if (msg.mentions.users.array().length > 1) {
            msg.reply('Ти зовсім дурне? Як я маю всіх підряд зареєструвати?');
            this.retardPlusPlus(msg);
        } else if (msg.content.split(' ').filter(word => word !== '').length !== 3) {
            msg.reply('Курва... Шо ти пишеш?.. Має бути "watch @КОРИСТУВАЧ DOTA_ID"');
            this.retardPlusPlus(msg);
        } else {
            this.dataStore.getProfile(parseInt(msg.content.match(/ \d+/)[0].trim())).subscribe(playerInfo => {
                if (!!playerInfo) {
                    this.dataStore.registeredPlayers.subscribe(playersMap => {
                        if (playersMap.get(playerInfo.account_id) && !this.isCreator(msg)) {
                            msg.reply('Вже закріплено за @' + playersMap.get(playerInfo.account_id));
                            this.retardPlusPlus(msg);
                        } else {
                            this.dataStore.registerPlayer(playerInfo.account_id, msg.mentions.users.first().id);
                            msg.reply('Я стежитиму за тобою, ' + playerInfo.personaname);
                        }
                    });
                } else {
                    msg.reply('Давай ще раз, але цього разу очима дивись на айді гравця');
                    this.retardPlusPlus(msg);
                }
            });
        }
    }

    private isCreator(msg: Message): boolean {
        return msg.author.id === process.env.creatorId;
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
        richEmbed.setImage(avatarUrl);
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
        const arr = this.parseTopNMessage(msg);
        if (arr.length !== 0) {
            const n = arr.length === 3 ? 3 : parseInt(arr[2]); // return top 3 by default
            const className = arr.length === 3 ? arr[2] : arr[3];
            const nominationName = className.toLowerCase();
            if (nominationName) {
                this.nominationService.getTopN(nominationName, n).subscribe(topRes => {
                    const accountIdsSet = topRes.map(r => r.account_id)
                        .filter((account_id: number, pos: number, self: number[]) => self.indexOf(account_id) === pos);
                    Observable.from(accountIdsSet)
                        .flatMap(account_id => this.dataStore.getProfile(account_id))
                        .reduce((profileMap: Map<number, string>, profile: ProfileJson) => {
                            profileMap.set(profile.account_id, profile.personaname);
                            return profileMap;
                        }, new Map())
                        .subscribe((profileMap: Map<number, string>) => {
                            const firstNomination =  topRes[0].nomination;
                            let msgText = 'Ці герої зуміли' + firstNomination.getScoreDescription() + '\n';
                            topRes.forEach((tr: NominationResult, index: number) => {
                                const place = index + 1;
                                msgText += place + ') ' + profileMap.get(tr.account_id) + ':\t' + tr.nomination.getScoreText() + '\n';
                            });
                            msg.reply(this.getRichEmbed(firstNomination.getName(), msgText, undefined, '#Тайтаке.'));
                        });
                });
            } else {
                this.retardPlusPlus(msg);
            }
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
