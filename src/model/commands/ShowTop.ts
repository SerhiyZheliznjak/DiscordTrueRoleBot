import { CommandBase } from "../Command";
import { Message, Client, TextChannel, GuildChannel, RichEmbed } from "discord.js";
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
        if (!this.isLocked(msg)) {
            const args = this.parseArgs(msg);
            if (args && args.className) {
                const pendingChannels = this.queue.get(args.className);
                if (pendingChannels) {
                    const exists = pendingChannels.find((ch: TextChannel) => ch.equals(msg.channel as GuildChannel));
                    if (!exists) {
                        pendingChannels.push(msg.channel as TextChannel);
                    } else {
                        this.retardPlusPlus(msg);
                    }
                } else {
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
                            .subscribe((profileMap: Map<number, string>) => this.sendTopNMessage(args.className, profileMap, topRes));
                    });
                }
            } else {
                this.retardPlusPlus(msg);
            }
        }
    }

    public sendTopNMessage(className: string, profileMap: Map<number, string>, topRes: NominationResult[]): void {
        this.queue.get(className).forEach(channel => {
            const embed = this.generateEmbed(profileMap, topRes);
            if (embed) {
                channel.send('', embed);
                this.queue.delete(className);
            }
        });
    }

    public generateEmbed(profileMap: Map<number, string>, topRes: NominationResult[]): RichEmbed {
        if (profileMap.size && topRes.length) {
            const longestProfileName = this.getLongestLength(profileMap);
            const firstNomination = topRes[0].nomination;
            let msgText = '';
            topRes.forEach((tr: NominationResult, index: number) => {
                const place = index + 1;
                const name = profileMap.get(tr.account_id).padEnd(longestProfileName);
                msgText += '#' + place + ' ' + name + ': ' + tr.nomination.scoreToString() + '\n';
            });
            const richEmbed = new RichEmbed();
            richEmbed.setTitle('Вони зуміли' + firstNomination.getScoreDescription());
            richEmbed.setDescription(DiscordUtils.formatAsBlock(msgText));
            richEmbed.setThumbnail(firstNomination.getThumbURL());
            richEmbed.setFooter('#Тайтаке.');
            return richEmbed;
        }
    }

    public getLongestLength(profileMap: Map<number, string>): number {
        return DiscordUtils.getLongestLength([...profileMap].map(p => p[1]));
    }

    public helpText(): string {
        return 'top NOMINATION_KEY, використовуй команду nominationkeys щоб дізнатись ключ потрібної номінації';
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
