import { CommandBase } from "../Command";
import { Message } from "discord.js";
import { DiscordUtils } from "../../utils/DiscordUtils";

export class TopTeams extends CommandBase {
    public process(msg: Message): void {
        if (!this.isLocked(msg)) {
            this.dataStore.getTeams().subscribe(teams => {
                const digits = this.getArgs(msg.content.toLowerCase()).find(arg => /\d+/.test(arg));
                const n = !digits ? 10 : +digits.match(/\d+/)[0];
                const topTeams = teams.slice(0, n);
                const maxNameLength = Math.max(...(topTeams.map(t => t.name.length)));
                let nameText = 'Команда';
                const winrateText = 'Вінрейт';
                const sumText = 'Матчів';
                if (maxNameLength > nameText.length) {
                    nameText = DiscordUtils.fillWithSpaces(nameText, maxNameLength);
                }
                const message = topTeams.reduce((msg, team) => {
                    const winrate = DiscordUtils.getPercentString(Math.round(team.wins / (team.losses + team.wins) * 10000) / 100);
                    return msg + DiscordUtils.fillWithSpaces(String(team.name), nameText.length) + ' | '
                        +DiscordUtils.fillWithSpaces(String(winrate), winrateText.length) + ' | ' + team.losses + team.wins + '\n';
                }, '```' + nameText + ' | ' + winrateText + ' | ' + sumText + '\n');
                msg.channel.send(message + '```');
            });
        }
    }

    public helpText(): string {
        return 'Повертає топ N професійних команд, N = 10 за замовчуванням';
    }
}
