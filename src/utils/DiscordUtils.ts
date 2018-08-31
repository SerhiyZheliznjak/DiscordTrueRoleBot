import { RichEmbed, MessageEmbedField } from "discord.js";
import { Observable } from "rxjs";
import NominationResult from "../model/NominationResult";
import DataStore from "../services/DataStore";
import Pair from "../model/Pair";
import { ProfileJson } from "../dota-api/DotaJsonTypings";

export class DiscordUtils {
    public static generateMessages(claimedNominations: NominationResult[], dataStore: DataStore): Observable<RichEmbed> {
        return Observable.from(claimedNominations)
            .flatMap(cn => DiscordUtils.getNomiPlayerPair(cn, dataStore))
            .map(pair => {
                const richEmbed = new RichEmbed();
                richEmbed.setAuthor(pair.p1.nomination.getName(), pair.p2.avatarmedium);
                richEmbed.setTitle(pair.p2.personaname);
                richEmbed.setDescription(pair.p1.nomination.getMessage());
                richEmbed.setThumbnail(pair.p1.nomination.getThumbURL());
                richEmbed.setFooter(pair.p1.nomination.getScoreText());
                richEmbed.setURL(pair.p2.profileurl);
                return richEmbed;
            });
    }

    public static getNomiPlayerPair(nomiRes: NominationResult, dataStore: DataStore): Observable<Pair<NominationResult, ProfileJson>> {
        return dataStore.getProfile(nomiRes.account_id).map(profile => new Pair(nomiRes, profile));
    }

    // public static fillWithSpaces(text: string, desiredLength: number): string {
    //     return desiredLength - text.length > 0 ? text + ' '.repeat(desiredLength - text.length) : text;
    // }

    public static getLongestLength(arr: string[]): number {
        return Math.max(...arr.map(s => s.length));
    }

    public static formatAsBlock(text: string): string {
        return '```bash\n' + text + '\n```';
    }

    public static getPercentString(n: number): string {
        let result = '' + n;
        if (n < 10) {
            result = ' ' + n;
        }
        if (result.split('.').length === 1) {
            result += '.';
        }
        return (result + '00').slice(0, 5) + '%';
    }
}
