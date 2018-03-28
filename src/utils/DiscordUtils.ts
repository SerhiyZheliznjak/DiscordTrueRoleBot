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
                richEmbed.setTitle(pair.p2.personaname + ': ' + pair.p1.nomination.getName());
                richEmbed.setDescription(pair.p1.nomination.getMessage());
                richEmbed.setThumbnail(pair.p2.avatarmedium);
                richEmbed.setFooter(pair.p1.nomination.getScoreText());
                richEmbed.setURL(pair.p2.profileurl);
                return richEmbed;
            });
    }

    public static getNomiPlayerPair(nomiRes: NominationResult, dataStore: DataStore): Observable<Pair<NominationResult, ProfileJson>> {
        return dataStore.getProfile(nomiRes.account_id).map(profile => new Pair(nomiRes, profile));
    }

    public static fillWithSpaces(text: string, desiredLength: number): string {
        return desiredLength - text.length > 0 ? text + ' '.repeat(desiredLength - text.length) : text;
    }

    public static getLongestLength(arr: string[]): number {
        return Math.max(...arr.map(s => s.length));
    }

    public static formatAsBlock(text: string): string {
        return '```bash\n' + text + '\n```';
    }
}
