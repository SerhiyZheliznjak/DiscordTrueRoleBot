import { CommandBase } from '../Command';
import { Observable } from 'rxjs';
import { Message } from 'discord.js';
import { WinLossJson } from '../../dota-api/DotaJsonTypings';
import { DiscordUtils } from '../../utils/DiscordUtils';

export class WinRate extends CommandBase {
    private alreadyProcessing = false;

    public process(msg: Message): void {
        const arr = this.getArgs(msg.content.toLowerCase());
        if (this.alreadyProcessing) {
            msg.reply('Я знав що так буде, retardPlusPlus()');
            this.retardPlusPlus(msg);
            return;
        }
        if (arr.length === 0) {
            this.alreadyProcessing = true;
            this.dataStore.registeredPlayers.subscribe((registeredPlayers: Map<number, string>) => {
                const profileIds = Array.from(registeredPlayers.keys());
                Observable.forkJoin(
                    profileIds.map(
                        account_id => this.mapAccountIdToWinRate(
                            account_id,
                            this.dataStore.getWinLoss(account_id)
                        )
                    )
                ).subscribe(accWinRate => this.sendMessage(msg, accWinRate));
            });
        } else {
            this.retardPlusPlus(msg);
        }
    }

    private mapAccountIdToWinRate(account_id: number, winLoss: Observable<WinLossJson>): Observable<AccountWinRate> {
        return winLoss.map(wl => {
            const winrate = wl.win / (wl.lose + wl.win);
            return new AccountWinRate(account_id, Math.round(winrate * 10000) / 100);
        });
    }

    private sendMessage(msg: Message, accWinRates: AccountWinRate[]): void {
        Observable.forkJoin(accWinRates.map(awr => this.populateWithName(awr)))
            .subscribe(winrates => {
                const winratesMsg = winrates.sort((a, b) => b.winRate - a.winRate)
                .reduce((message, wr) => {
                    const sign = wr.winRate > 50 ? '+' : '-';
                    return message + sign + ' ' + wr.winRate + '%: ' + wr.name + '\n';
                }, '```diff\n');
                msg.reply(winratesMsg + '#тайтаке```');
                this.alreadyProcessing = false;
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
    constructor(public account_id: number, public winRate: number, public name?: string) { }
}
