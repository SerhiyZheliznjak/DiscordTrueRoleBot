import { CommandBase } from '../Command';
import { Observable } from 'rxjs';
import { Message } from 'discord.js';
import { WinLossJson } from '../../dota-api/DotaJsonTypings';
import { DiscordUtils } from '../../utils/DiscordUtils';

export class WinRate extends CommandBase {
    public process(msg: Message): void {
        if (!this.isLocked(msg)) {
            this.lock();
            this.dataStore.registeredPlayers.subscribe((registeredPlayers: Map<number, string>) => {
                const msgContent = msg.content.toLowerCase();
                if (this.getArgs(msg.content.toLowerCase()).length > 0) {
                    this.dataStore.getHeroes().subscribe(heroes => {
                        let hero_id;
                        const heroNames = Array.from(heroes.keys());
                        const heroName = heroNames.find(hn => msgContent.indexOf(hn.toLowerCase()) > -1);
                        if (heroName) {
                            hero_id = heroes.get(heroName);
                        }
                        this.countWinRate(msg, registeredPlayers, hero_id, heroName);
                    });
                } else {
                    this.countWinRate(msg, registeredPlayers);
                }
            });

        }
    }

    public helpText(): string {
        return 'winrate all? HERO_NAME? without? @MENTION\nякщо не вказати all то порахує лише для того хто то викликав команду;\n'
        + 'HERO_NAME опційне, рахуватиме ігри на цьому герої;\n'
        + '@MENTION дискорд згадка з якими гравцями рахувати ігри, можна кілька;\nwithout опційне буде рахувати ігри без згаданих гравців.';
    }

    private countWinRate(msg: Message, registeredPlayers: Map<number, string>, hero_id?: number, heroName?: string) {
        const msgContent = msg.content.toLowerCase();
        const args = this.getArgs(msgContent);
        const mentions = args.filter(a => a.startsWith('<@')).map(m => m.match(/\d+/)[0]);
        let accountIdsToCount: number[];
        let mentionedIds: number[];
        let with_ids: number[];
        let without_ids: number[];
        let messageHeader = 'Вінрейт ';

        if (heroName) {
            messageHeader += 'на ' + heroName + ' ';
        }

        if (args.indexOf('all') > -1) {
            accountIdsToCount = Array.from(registeredPlayers.keys());
        } else {
            accountIdsToCount = this.getAccountId([msg.member.id], registeredPlayers);
        }

        if (mentions.length === 0) {
            mentionedIds = [];
        } else {
            mentionedIds = this.getAccountId(mentions, registeredPlayers);
            if (msgContent.indexOf('without') > -1) {
                without_ids = mentionedIds;
                messageHeader += ' без ';
            } else {
                with_ids = mentionedIds;
                messageHeader += ' з ';
            }
            messageHeader += Array.from(msg.mentions.members.values()).map(member => member.displayName).join(', ') ;
        }

        Observable.forkJoin(
            accountIdsToCount.map(
                account_id => this.mapAccountIdToWinRate(account_id, this.dataStore.getWinLoss(account_id, hero_id, with_ids, without_ids)
                )
            )
        ).subscribe((accWinRate: AccountWinRate[]) => this.sendMessage(msg, accWinRate, messageHeader));
    }

    private getAccountId(discordIds: string[], registeredPlayers: Map<number, string>): number[] {
        return Array.from(registeredPlayers.entries())
        .filter(kv => discordIds.indexOf(kv[1]) > -1)
        .map(kv => kv[0]);
    }

    private mapAccountIdToWinRate(account_id: number, winLoss: Observable<WinLossJson>): Observable<AccountWinRate> {
        return winLoss.map(wl => {
            const winrate = wl.win / (wl.lose + wl.win);
            return new AccountWinRate(account_id, Math.round(winrate * 10000) / 100, wl.win + wl.lose);
        });
    }

    private sendMessage(msg: Message, accWinRates: AccountWinRate[], messageHeader: string): void {
        Observable.forkJoin(accWinRates.map(awr => this.populateWithName(awr)))
            .subscribe(winrates => {
                const winratesMsg = winrates.sort((a, b) => b.winRate - a.winRate)
                    .reduce((message, wr) => {
                        const sign = wr.winRate > 50 ? '+' : '-';
                        const winRate = isNaN(wr.winRate) ? '-' : wr.winRate;
                        return message + sign + ' ' + winRate + '% з ' + wr.count + ': ' + wr.name + '\n';
                    }, '```diff\n' + messageHeader + '\n');
                msg.reply(winratesMsg + '#тайтаке```');
                this.unlock();
            });
    }

    private populateWithName(awr: AccountWinRate): Observable<AccountWinRate> {
        return this.dataStore.getProfile(awr.account_id).map(profile => {
            awr.name = profile.personaname;
            return awr;
        });
    }
}

class AccountWinRate {
    constructor(public account_id: number, public winRate: number, public count: number, public name?: string) { }
}
