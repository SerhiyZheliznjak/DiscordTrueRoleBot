import { CommandBase } from "../Command";
import { Message, Client, TextChannel, GuildChannel } from "discord.js";
import { Observable } from "rxjs";
import NominationService from "../../services/NominationService";
import DataStore from "../../services/DataStore";
import { ProfileJson } from "../../dota-api/DotaJsonTypings";
import NominationResult from "../NominationResult";
import { DiscordUtils } from "../../utils/DiscordUtils";

export class ShowTop extends CommandBase {
    private queue: Map<string, TextChannel[]>;

    constructor(
        client: Client,
        dataStore: DataStore,
        private nominationService: NominationService
    ) {
        super(client, dataStore);
        this.queue = new Map();
    }

    public process(msg: Message): void {
        const args = this.parseArgs(msg);
        if (args && args.className) {
            const pendingChannels = this.queue.get(args.className);
            if (pendingChannels) {
                const exists = pendingChannels.find((ch: TextChannel) => ch.equals(msg.channel as GuildChannel));
                if (!exists) {
                    console.log('adding new channel to queue');
                    pendingChannels.push(msg.channel as TextChannel);
                } else {
                    this.retardPlusPlus(msg);
                }
            } else {
                console.log('sending request to get top best');
                this.queue.set(args.className, [msg.channel as TextChannel]);
                this.nominationService.getTopN(args.className, args.n).subscribe(topRes => {
                    const accountIdsSet = topRes.map(r => r.account_id)
                        .filter((account_id: number, pos: number, self: number[]) => self.indexOf(account_id) === pos);
                    Observable.from(accountIdsSet)
                        .flatMap(account_id => this.dataStore.getProfile(account_id))
                        .reduce((profileMap: Map<number, string>, profile: ProfileJson) => {
                            profileMap.set(profile.account_id, profile.personaname);
                            return profileMap;
                        }, new Map())
                        .subscribe((profileMap: Map<number, string>) => {
                            const firstNomination = topRes[0].nomination;
                            let msgText = 'Вони зуміли\n';
                            topRes.forEach((tr: NominationResult, index: number) => {
                                const place = index + 1;
                                msgText += place + ') ' + profileMap.get(tr.account_id) + ':\t' + tr.nomination.getScoreText() + '\n';
                            });
                            this.queue.get(args.className).forEach(channel => {
                                channel.send('', DiscordUtils.getRichEmbed(firstNomination.getName(), msgText, undefined, '#Тайтаке.'));
                            });
                        });
                });
            }
        } else {
            this.retardPlusPlus(msg);
        }
    }

    private parseArgs(msg: Message): TopArgs {
        const arr = this.getArgs(msg.content.toLowerCase());
        if (arr.length === 1) {
            return new TopArgs(3, arr[0]);
        } else if (arr.length === 2) {
            const n = parseInt(arr[0]);
            if (isNaN(n)) {
                console.error('second arg is not a number');
            } else {
                return new TopArgs(n, arr[1]);
            }
        }
        return undefined;
    }
}

class TopArgs {
    constructor(public n: number, public className: string) {
        this.className = className.toLowerCase();
    }
}
