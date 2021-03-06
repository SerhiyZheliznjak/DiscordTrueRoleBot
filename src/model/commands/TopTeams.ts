import { CommandBase } from "../Command";
import { Message } from "discord.js";
import { DiscordUtils } from "../../utils/DiscordUtils";
import { TeamJson } from "../../dota-api/DotaJsonTypings";

export class TopTeams extends CommandBase {
    private defaultN = 5;
    private nameText = 'Команда';
    private winrateText = 'Вінрейт';
    private sumText = 'Матчів';

    public process(msg: Message): void {
        if (!this.isLocked(msg)) {
            this.dataStore.getTeams().subscribe(teams => {
                const digits = this.getArgs(msg.content.toLowerCase()).find(arg => /\d+/.test(arg));
                const numberOfTeams = !digits ? this.defaultN : +digits.match(/\d+/)[0];
                const topTeams = teams.slice(0, numberOfTeams);
                const maxNameLength = Math.max(...(topTeams.map((t, index) => {
                    const placeText = this.getPlaceText(index);
                    return this.getTeamName(t).length + placeText.length;
                })));

                if (maxNameLength > this.nameText.length) {
                    this.nameText = this.nameText.padEnd(maxNameLength);
                }
                const message = topTeams.reduce((text, team) => {
                    const winrate = DiscordUtils.getPercentString(Math.round(team.wins / (team.losses + team.wins) * 10000) / 100);
                    const gamesPlayed = team.losses + team.wins;
                    return text + (this.getPlaceText(topTeams.indexOf(team)) + this.getTeamName(team)).padEnd(this.nameText.length) + ' | '
                     + String(winrate).padEnd(this.winrateText.length) + ' | '
                     + gamesPlayed + '\n';
                }, '');

                this.sendMessage(msg, message.split('\n'));
                if (!this.hasNaVi(topTeams)) {
                    msg.channel.send('```cs\n#НАВІ В КАНАВІ```');
                }
            });
        }
    }

    public helpText(): string {
        return 'Повертає топ N професійних команд, N = ' + this.defaultN + ' за замовчуванням';
    }

    private sendMessage(msg: Message, message: string[]): void {
        if (message.join('\n').length > 1994 - this.getTableHead().length) {
            let part = '';
            let i = 0;
            while ((part + message[i]).length < 1994 - this.getTableHead().length) {
                part += message[i] + '\n';
                i++;
            }
            msg.channel.send(this.wrapMessage(part));
            this.sendMessage(msg, message.slice(i));
        } else {
            msg.channel.send(this.wrapMessage(message.join('\n')));
        }
    }

    private getTableHead(): string {
        return this.nameText + ' | ' + this.winrateText + ' | ' + this.sumText + '\n';
    }

    private wrapMessage(message: string): string {
        return '```' + this.getTableHead() + message + '```';
    }

    private trimMessage(msg: string): string {
        return msg.length < 2000 ? msg : msg.slice(0, 1990) + '```';
    }

    private hasNaVi(topTeams: TeamJson[]): boolean {
        return !!topTeams.find(t => t.team_id === 36);
    }

    private getPlaceText(index: number): string {
        return index + 1 + '. ';
    }

    private getTeamName(team: TeamJson): string {
        return !!team.name ? team.name : !!team.tag ? team.tag : 'API issue!';
    }
}
