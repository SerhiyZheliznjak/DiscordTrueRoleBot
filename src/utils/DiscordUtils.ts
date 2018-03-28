import { RichEmbed, MessageEmbedField } from "discord.js";
import { Observable } from "rxjs";
import NominationResult from "../model/NominationResult";
import DataStore from "../services/DataStore";
import Pair from "../model/Pair";
import { ProfileJson } from "../dota-api/DotaJsonTypings";

export class DiscordUtils {
    public static getRichEmbed(
        title: string,
        description: string,
        avatarUrl?: string,
        footer?: string,
        url?: string,
        imageUrl?: string,
        fields?: MessageEmbedField[]
    ): RichEmbed {
        const richEmbed = new RichEmbed();
        richEmbed.setTitle(title);
        richEmbed.setDescription(description);
        if (avatarUrl) {
            richEmbed.setThumbnail(avatarUrl);
        }
        if (footer) {
            richEmbed.setFooter(footer);
        }
        if (url) {
            richEmbed.setURL(url);
        }
        if (imageUrl) {
            richEmbed.setImage(imageUrl);
        }
        if (fields) {
            fields.forEach(field => richEmbed.addField(field.name, field.value, field.inline));
        }
        return richEmbed;
    }

    public static generateMessages(claimedNominations: NominationResult[], dataStore: DataStore): Observable<RichEmbed> {
        return Observable.from(claimedNominations)
            .flatMap(cn => DiscordUtils.getNomiPlayerPair(cn, dataStore))
            .map(pair => DiscordUtils.getRichEmbed(
                pair.p2.personaname + ': ' + pair.p1.nomination.getName(),
                pair.p1.nomination.getMessage(),
                pair.p1.nomination.getThumbURL(),
                pair.p1.nomination.getScoreText(),
                pair.p2.profileurl,
                pair.p2.avatarmedium
            ));
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
