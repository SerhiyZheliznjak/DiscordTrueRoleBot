import { CommandBase } from "../Command";
import { Message } from "discord.js";
import { DiscordUtils } from "../../utils/DiscordUtils";

export class TeamRates extends CommandBase {
    public process(msg: Message): void {
        if (!this.isLocked(msg)) {
            this.dataStore.getTeams().subscribe(teams => {
                const digits = this.getArgs(msg.content.toLowerCase()).find(arg => /\d+/.test(arg));
                const n = !digits ? 10 : +digits.match(/\d+/)[0];
                const topTeams = teams.slice(0, n);
                const maxNumberLength = String(Math.max(...(topTeams.map(t => t.wins + t.losses)))).length;
                const message = topTeams.reduce((msg, team) => {
                    const winrate = DiscordUtils.getPercentString(Math.round(team.wins / (team.losses + team.wins) * 10000) / 100);
                    return msg + DiscordUtils.fillWithSpaces(String(winrate), 7) + ' | '
                        + DiscordUtils.fillWithSpaces(String(team.losses + team.wins), Math.max(maxNumberLength, 6)) + ' | ' + team.name + '\n';
                }, '```Вінрейт | Матчів | Команда\n');
                msg.channel.send(message + '```');
            });
        }
    }

    public helpText(): string {
        return 'Повертає топ N професійних команд, N = 10 за замовчуванням';
    }
}
