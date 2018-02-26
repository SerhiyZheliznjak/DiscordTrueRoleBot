import { Message, Client, RichEmbed } from 'discord.js';
import { Observable, Subscription, Observer } from 'rxjs';
import DataStore from './DataStore';
import NominationService from './NominationService';
import DotaApi from '../dota-api/DotaApi';
import Pair from '../model/Pair';
import { RecentMatchJson, ProfileJson } from '../dota-api/DotaJsonTypings';
import ScoreBoard from '../model/ScoreBoard';
import NominationWinner from '../model/NominationWinner';
import { Constants } from '../Constants';

const Auth = require('../../config/auth.json');

export class BotService {
    private retardMap = new Map();
    private playersMap = new Map<number, string>();
    private subscription: Subscription;
    private recentGamesObserver: Observer<number>;
    private chanel;

    constructor(
        private client: Client,
        private dataStore: DataStore = new DataStore(),
        private nominationService: NominationService = new NominationService(),
        private dotaApi: DotaApi = new DotaApi()
    ) {
        this.playersMap.set(298134653, '407971834689093632'); // Dno
        this.playersMap.set(333303976, '407949091163865099'); // Tee Hee
        this.playersMap.set(118975931, '289388465034887178'); // I'm 12 btw GG.BET
        this.playersMap.set(86848474, '408363774257528852'); // whoami
        this.playersMap.set(314684987, '413792999030652938'); // blackRose
        this.playersMap.set(36753317, '408172132875501581'); // =3

        this.recentGamesObserver = {
            next: () => this.recentGamesObserverNext(),
            error: () => { },
            complete: () => { }
        };
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
        if (msg.content.toLowerCase().startsWith("watch ")) {
            this.addWatch(msg);
        }
        if (msg.content.toLocaleLowerCase() === 'watchlist') {
            this.showRegistered(msg);
        }
    }

    public forgiveRetards() {
        Observable.interval(1000 * 60 * 60 * 24).subscribe(() => this.retardMap = new Map());
    }

    public startWatching() {
        DataStore.maxMatches = this.playersMap.size * 20;
        this.chanel = this.client.channels.find('type', 'text');
        this.subscription = Observable.interval(1000 * 60 * 60).subscribe(this.recentGamesObserver);
        this.recentGamesObserver.next(0);
    }

    public stopWatching(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        console.log('stopped watching');
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
    }

    private shutUpYouRRetard(msg: Message): void {
        const shutRetard = ['Стягнув', 'Ти такий розумний', 'Помовчи трохи', 'Т-с-с-с-с-с-с',
            'Біжи далеко', 'Ти можеш трохи тихо побути?', 'Ціхо', 'Каца!', 'Таааась тась тась',
            'Люди, йдіть сі подивіть', 'Інколи краще жувати', 'Ти то серйозно?', 'Молодець'];
        msg.reply(shutRetard[Math.floor(Math.random() * shutRetard.length)]);
    }

    private registerall(msg) {
        if (!this.isCreator(msg)) {
            this.retardPlusPlus(msg);
            msg.reply('хуєгістеролл');
        }
    }

    private restart(msg) {
        if (this.isCreator(msg)) {
            this.stopWatching();
            this.startWatching();
        } else {
            this.retardPlusPlus(msg);
            msg.reply('хуємпездрестарт');
        }
    }

    private showRegistered(msg) {
        if (this.isCreator(msg)) {
            let registered = 'Стежу за: ';
            for (const info of this.playersMap) {
                registered += info + '\n';
            }
            msg.reply(registered);
        } else {
            this.retardPlusPlus(msg);
            msg.reply('хуйочліст');
        }
    }

    private addWatch(msg) {
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
            this.dataStore.getProfile(msg.content.match(/ \d+/)[0].trim()).subscribe(playerInfo => {
                if (!!playerInfo) {
                    if (this.playersMap.get(playerInfo.account_id) && !this.isCreator(msg)) {
                        msg.reply('Вже закріплено за @' + this.playersMap.get(playerInfo.account_id));
                        this.retardPlusPlus(msg);
                    } else {
                        this.playersMap.set(playerInfo.account_id, msg.mentions.users.first().id);
                        msg.reply('Я стежитиму за тобою, ' + playerInfo.personaname);
                    }
                } else {
                    msg.reply('Давай ще раз, але цього разу очима дивись на айді гравця');
                    this.retardPlusPlus(msg);
                }
            });
        }
    }

    private isCreator(msg) {
        return msg.author.id === Auth.creatorId;
    }

    private getDotaIds(): number[] {
        const dotaIds = [];
        for (const id of this.playersMap.keys()) {
            dotaIds.push(id);
        }
        return dotaIds;
    }

    private getRichEmbed(title: string, description: string, avatarUrl: string, footer: string, url?: string): RichEmbed {
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

    private recentGamesObserverNext() {
        Observable.forkJoin(
            this.getDotaIds().map(account_id =>
                this.dotaApi.getRecentMatches(account_id)
                    .map(recentMatch => new Pair(account_id, (recentMatch as RecentMatchJson[]).map(m => m.match_id))))
        ).subscribe(playerRecentMatches => {
            console.log('--------joined all the matches hasNewMatches-----------', this.hasNewMatches(playerRecentMatches));
            if (this.hasNewMatches(playerRecentMatches)) {
                this.nominationService.nominate(playerRecentMatches).subscribe(scoreBoard => {
                    console.log('-----------lets award some players-----------', scoreBoard.nominationsWinners.size);
                    this.awardWinners(scoreBoard);
                });
                playerRecentMatches.forEach(p => this.dataStore.updatePlayerRecentMatches(p.key, p.val));
                this.dataStore.saveRecentMatches();
            }
        });
    }

    private hasNewMatches(playerRecentMatches: Array<Pair<number, number[]>>): boolean {
        const atLeastOneNewMatch = playerRecentMatches.find(pair => {
            const newMatches = pair.val.filter(match_id => {
                const prm = this.dataStore.playerRecentMatchesCache.get(pair.key);
                return prm ? prm.indexOf(match_id) < 0 : true;
            });
            return newMatches.length > 0;
        });
        return !!atLeastOneNewMatch;
    }

    private awardWinners(scoreBoard: ScoreBoard): void {
        const newNomintionsClaimed: NominationWinner[] = [];
        for (const nominationName of scoreBoard.nominationsWinners.keys()) {
            const newWinner = scoreBoard.nominationsWinners.get(nominationName);
            if (newWinner.account_id !== Constants.UNCLAIMED && newWinner.nomination.isScored()) {
                const storedWinner = this.dataStore.wonNominationCache.get(nominationName);
                if (!storedWinner || storedWinner.nomination.getScore() < newWinner.nomination.getScore()) {
                    newNomintionsClaimed.push(newWinner);
                }
            }
        }

        if (!!newNomintionsClaimed.length) {
            console.log('awarding winners ', newNomintionsClaimed.length);
            this.dataStore.saveWinnersScore(scoreBoard.nominationsWinners);
            this.generateMessages(newNomintionsClaimed).subscribe((richEmbed: RichEmbed) => {
                console.log('sending message about ', richEmbed.title);
                this.chanel.send('', richEmbed);
            });
        }
    }

    private generateMessages(claimedNominations: NominationWinner[]) {
        return Observable.create((messagesObserver: Observer<RichEmbed>) => {
            this.getPlayerProfilesSet(claimedNominations).subscribe(players => {
                claimedNominations.forEach(claimed => {
                    const player = players.find(p => +p.account_id === +claimed.account_id);
                    messagesObserver.next(this.getRichEmbed(
                        player.personaname + ' ' + claimed.nomination.getName(),
                        claimed.nomination.getMessage(),
                        player.avatarmedium,
                        'Рахунок: ' + claimed.nomination.getScoreText(),
                        player.profileurl
                    ));
                });
                messagesObserver.complete();
            });
        });
    }

    private getPlayerProfilesSet(claimedNominations: NominationWinner[]): Observable<ProfileJson[]> {
        return this.dataStore.getPlayers(claimedNominations.map(cn => cn.account_id).reduce((uniq, id) => {
            if (uniq.indexOf(id) < 0) {
                uniq.push(id);
            }
            return uniq;
        }, []));
    }
}
