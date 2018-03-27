import { CommandBase } from "../Command";
import { Message, Client } from "discord.js";
import { Observable } from "rxjs";
import NominationService from "../../services/NominationService";
import DataStore from "../../services/DataStore";
import { ProfileJson } from "../../dota-api/DotaJsonTypings";
import NominationResult from "../NominationResult";

export class ShowTop extends CommandBase {
    constructor(
        client: Client,
        private nominationService: NominationService = new NominationService(),
        private dataStore: DataStore = new DataStore()
    ) {
        super(client);
    }

    public process(msg: Message): void {
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
                            const firstNomination = topRes[0].nomination;
                            let msgText = 'Ці герої зуміли' + firstNomination.getScoreDescription() + '\n';
                            topRes.forEach((tr: NominationResult, index: number) => {
                                const place = index + 1;
                                msgText += place + ') ' + profileMap.get(tr.account_id) + ':\t' + tr.nomination.getScoreText() + '\n';
                            });
                            msg.channel.send('', this.getRichEmbed(firstNomination.getName(), msgText, undefined, '#Тайтаке.'));
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
