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
                let numberOfTeams = !digits ? this.defaultN : +digits.match(/\d+/)[0];
                const topTeams = teams.slice(0, numberOfTeams);
                const maxNameLength = Math.max(...(topTeams.map((t, index) => {
                    const placeText = this.getPlaceText(index);
                    return t.name.length + placeText.length;
                })));

                if (maxNameLength > this.nameText.length) {
                    this.nameText = DiscordUtils.fillWithSpaces(this.nameText, maxNameLength);
                }
                const message = topTeams.reduce((msg, team) => {
                    const winrate = DiscordUtils.getPercentString(Math.round(team.wins / (team.losses + team.wins) * 10000) / 100);
                    return msg + DiscordUtils.fillWithSpaces(this.getPlaceText(topTeams.indexOf(team)) + team.name, this.nameText.length) + ' | '
                        + DiscordUtils.fillWithSpaces(String(winrate), this.winrateText.length) + ' | ' + team.losses + team.wins + '\n';
                }, '');

                this.sendMessage(msg, message.split('\n'));
                if (!this.hasNaVi(topTeams)) {
                    msg.channel.send('```cs\n#НАВІ В КАНАВІ```');
                }
            });
        }
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

    public helpText(): string {
        return 'Повертає топ N професійних команд, N = ' + this.defaultN + ' за замовчуванням';
    }
}
