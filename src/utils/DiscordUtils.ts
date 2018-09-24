import { RichEmbed } from "discord.js";
import { Observable } from "rxjs";
import NominationResult from "../model/NominationResult";
import DataStore from "../services/DataStore";
import { ProfileJson } from "../dota-api/DotaJsonTypings";

export class DiscordUtils {
    public static generateMessages(claimedNominations: NominationResult[], dataStore: DataStore): Observable<RichEmbed> {
        return Observable.from(claimedNominations)
            .flatMap(cn => DiscordUtils.getNomiPlayerTuple(cn, dataStore))
            .map(tuple => {
                const richEmbed = new RichEmbed();
                richEmbed.setAuthor(tuple[0].nomination.getName(), tuple[1].avatarmedium);
                richEmbed.setTitle(tuple[1].personaname);
                richEmbed.setDescription(tuple[0].nomination.getMessage());
                richEmbed.setThumbnail(tuple[0].nomination.getThumbURL());
                richEmbed.setFooter(tuple[0].nomination.getScoreText());
                richEmbed.setURL(tuple[1].profileurl);
                return richEmbed;
            });
    }

    public static failSafe(p: ProfileJson, account_id: number): ProfileJson {
        if (p) {
            return p;
        } else {
            const stub = new ProfileJson();
            stub.personaname = account_id + '';
            return stub;
        }
    }

    public static getNomiPlayerTuple(nomiRes: NominationResult, dataStore: DataStore): Observable<[NominationResult, ProfileJson]> {
        return dataStore.getProfile(nomiRes.account_id).map(
            profile => [nomiRes, this.failSafe(profile, nomiRes.account_id)] as [NominationResult, ProfileJson]
        );
    }

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
