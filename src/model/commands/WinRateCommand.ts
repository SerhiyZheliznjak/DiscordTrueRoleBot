import { CommandBase } from '../Command';
import { Observable } from 'rxjs';
import { Message } from 'discord.js';
import { WinLossJson } from '../../dota-api/DotaJsonTypings';

export class WinRate extends CommandBase {
    public process(msg: Message): void {
        if (!this.isLocked(msg)) {
            this.lock();
            this.dataStore.registeredPlayers.subscribe((registeredPlayers: Map<number, string>) => {
                const args = this.getArgs(msg.content.toLowerCase());
                if (args.length > 0) {
                    this.dataStore.getHeroes().subscribe(heroes => {
                        let hero_id;
                        const heroNames = Array.from(heroes.keys());
                        const heroName = heroNames.find(hn => args.indexOf(hn.toLowerCase()) > -1);
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
        return 'winrate @MENTION? HERO_NAME? without? @MENTION\n'
        + '@MENTION рахуватиме ігри з цими гравцями, якщо не вказати рахуватиме для всіх;\n'
        + 'HERO_NAME назва героя. Перший @MENTION - той хто ним грав, якщо нема то для всіх на цьому герої;\n'
        + 'without опційне буде рахувати ігри без гравців вказаних після without.';
    }

    private countWinRate(msg: Message, registeredPlayers: Map<number, string>, hero_id?: number, heroName?: string) {
        const msgContent = msg.content.toLowerCase();
        const args = this.getArgs(msgContent);
        const mentions = this.getIdsFromMentions(args);
        const with_ids: string[] = this.getWithOrWithouts(msgContent, registeredPlayers);
        const without_ids: string[] = this.getWithOrWithouts(msgContent, registeredPlayers, false);
        let accountIdsToCount: number[];
        let messageHeader = 'Вінрейт ';

        if (this.countingEachOne(args, with_ids)) {
            accountIdsToCount = Array.from(registeredPlayers.keys());
        } else if (mentions.length > 0) {
            if (with_ids.length) {
                messageHeader += this.getMentionedNamesString(msg, with_ids) + ' ';
            }
            if (without_ids.length) {
                messageHeader += 'без ' + this.getMentionedNamesString(msg, without_ids) + ' ';
            }
            accountIdsToCount = this.getDotaAccountId([with_ids.shift()], registeredPlayers);
        }

        if (heroName) {
            if (accountIdsToCount.length) {
                messageHeader += this.countingEachOne(args, with_ids) ? '' : 'коли ';
                messageHeader += this.getMentionedNamesString(msg, [registeredPlayers.get(accountIdsToCount[0])]) + ' ';
            }
            messageHeader += this.countingEachOne(args, with_ids) ? 'кожного на ' : 'грав на ';
            messageHeader += heroName + ' ';
        }

        Observable.forkJoin(
            accountIdsToCount.map(account_id => this.mapAccountIdToWinRate(
                account_id,
                this.dataStore.getWinLoss(
                    account_id, hero_id,
                    this.getDotaAccountId(with_ids, registeredPlayers),
                    this.getDotaAccountId(without_ids, registeredPlayers)
                )
            ))
        ).subscribe((accWinRate: AccountWinRate[]) => this.sendMessage(msg, accWinRate, messageHeader));
    }

    private countingEachOne(args: string[], with_ids: string[]): boolean {
        return args.length === 0 || with_ids.length === 0;
    }

    private getMentionedNamesString(msg: Message, mentioned: string[]): string {
        return Array.from(msg.mentions.members.values())
            .filter(member => mentioned.indexOf(member.id) > -1)
            .map(member => member.displayName).join(', ');
    }

    private getWithOrWithouts(msgContent: string, registeredPlayers: Map<number, string>, include = true): string[] {
        const index = include ? 0 : 1;
        const mentions = msgContent.split(' without ')[index];
        if (!!mentions) {
            return this.getIdsFromMentions(this.split(mentions));
        }
        return [];
    }

    private getIdsFromMentions(args: string[]): string[] {
        return args.filter(a => a.startsWith('<@')).map(m => m.match(/\d+/)[0]);
    }

    private getDotaAccountId(discordIds: string[], registeredPlayers: Map<number, string>): number[] {
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
                const winratesMsg = winrates.sort((a, b) => isNaN(a.winRate) || isNaN(b.winRate) ? 1 : b.winRate - a.winRate)
                    .reduce((message, wr) => {
                        const sign = wr.winRate > 50 ? '+' : '-';
                        const winRate = isNaN(wr.winRate) ? '-' : wr.winRate;
                        const palyerName = accWinRates.length > 1 ? ': ' + wr.name : '';
                        return message + sign + ' ' + winRate + '% з ' + wr.count + palyerName + '\n';
                    }, '```diff\n' + messageHeader + '\n');
                msg.channel.send(winratesMsg + '#тайтаке```');
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
