import Nomination from "../Nomination";
import { MatchJson } from "../../dota-api/DotaJsonTypings";

export class Nenza extends Nomination {
    private chatHistory: string[][];
    private nenzaWords: RegExp[];

    constructor(protected points: Array<[number, number | string]> = []) {
        super(points);
        this.name = 'Ненза';
        this.minScore = 1;
        this.chatHistory = [];
        this.nenzaWords = [
            this.getWordRegexp('ff'),
            this.getWordRegexp('fu'),
            this.getWordRegexp('fy'),
            this.getWordRegexp('report'),
            this.getWordRegexp('репорт'),
            this.getWordRegexp('пездець'),
            this.getWordRegexp('нахуй'),
            this.getWordRegexp('nahoi'),
            this.getWordRegexp('уйобок'),
            this.getWordRegexp('шлюхи'),
            this.getWordRegexp('шлюха'),
            this.getWordRegexp('підар'),
            this.getWordRegexp('suka'),
            this.getWordRegexp('blyat'),
            this.getWordRegexp('pidaras'),
            this.getWordRegexp('pidar'),
            this.getWordRegexp('fuck'),
            this.getWordRegexp('fucking'),
            this.getWordRegexp('noob'),
            this.getWordRegexp('єбало'),
            this.getWordRegexp('їбав'),
            this.getWordRegexp('їбало'),
            this.getWordRegexp('мут'),
            this.getWordRegexp('mute'),
            this.getWordRegexp('єваб')
        ];
    }

    public get msg(): string {
        return 'Цитую:\n```"' + this.chatHistory.reduce((flat, arr) => {
            flat.push(...arr);
            return flat;
        }, []).join('"\n"') + '"\n```';
    }

    public getScoreText(): string {
        return 'Кількість написаної херні в чаті: ' + this.getScore();
    }

    public getScoreDescription(): string {
        return ' понаписувати херні';
    }

    public getThumbURL(): string {
        return 'https://image.ibb.co/jLzG77/Nenza.jpg';
    }

    public scorePoint(match: MatchJson, player_slot: number): number {
        if (match && match.chat) {
            const nenzaMsg = match.chat.filter(msg => msg.player_slot === player_slot)
                .map(msg => msg.key)
                .filter(msgText => this.isNenzaMessage(msgText));
            if (nenzaMsg.length > 0) {
                this.chatHistory.push(nenzaMsg);
            }
            return nenzaMsg.length;
        }
        return 0;
    }

    public isNenzaMessage(msgText: string): boolean {
        if (msgText) {
            const nenzaWord = this.nenzaWords.find(regExp => regExp.test(msgText));
            return !!nenzaWord;
        } else {
            return false;
        }
    }

    private getWordRegexp(word: string): RegExp {
        return new RegExp(`(\\s|^)${word}(\\s|$)`, 'gi');
    }
}
