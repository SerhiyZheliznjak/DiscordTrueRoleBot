import Nomination from "../Nomination";
import { MatchJson } from "../../dota-api/DotaJsonTypings";

export class Nenza extends Nomination {
    private chatHistory: string[][];

    constructor(protected points: Array<[number, number | string]> = []) {
        super(points);
        this.name = 'Ненза';
        this.minScore = 1;
        this.chatHistory = [];
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
                .filter(msgText => {
                    const words = msgText ? msgText.toLowerCase().split(' ') : [''];
                    return words.indexOf('ff') > -1
                        || words.indexOf('report') > -1
                        || words.indexOf('пездець') > -1
                        || words.indexOf('нахуй') > -1
                        || words.indexOf('nahoi') > -1
                        || words.indexOf('уйобок') > -1
                        || words.indexOf('шлюхи') > -1
                        || words.indexOf('шлюха') > -1
                        || words.indexOf('підар') > -1
                        || words.indexOf('лох') > -1
                        || words.indexOf('suka') > -1
                        || words.indexOf('blyat') > -1
                        || words.indexOf('pidaras') > -1
                        || words.indexOf('fuck') > -1
                        || words.indexOf('noob') > -1
                        || words.indexOf('хуй') > -1;
                });
            if (nenzaMsg.length > 0) {
                this.chatHistory.push(nenzaMsg);
            }
            return nenzaMsg.length;
        }
        return 0;
    }
}
