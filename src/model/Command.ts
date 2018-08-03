import { Message, Client } from 'discord.js';
import Constants from '../Constants';
import DataStore from '../services/DataStore';

export abstract class CommandBase implements IProcessor {

    protected static retardMap = new Map();
    protected locked = false;

    constructor(protected client: Client, protected dataStore: DataStore) { }

    public abstract process(message: Message): void;

    public abstract helpText(): string;

    protected lock(): void {
        this.locked = true;
        setTimeout(() => this.unlock(), 3000);
    }

    protected unlock(): void {
        this.locked = false;
    }

    protected isLocked(msg: Message): boolean {
        if (this.locked) {
            msg.reply('Ваш запит дуже важливий для нас, будь ласка очікуйте на лінії');
            this.retardPlusPlus(msg);
        }
        return this.locked;
    }

    protected isCreator(message: Message): boolean {
        return message.author.id === process.env.creatorId;
    }

    protected getArgs(content: string): string[] {
        return this.split(content).slice(1);
    }

    protected split(content: string): string[] {
        return content.split(' ').filter(a => a.length);
    }

    protected isRetard(authorId: string): boolean {
        const retardCount = CommandBase.retardMap.get(authorId);
        if (retardCount && retardCount.length > 3 && retardCount) {
            return retardCount.reduce((r, c, i) => {
                const next = retardCount[i + 1];
                if (next) {
                    return r > next - c ? next - c : r;
                }
                return r;
            }) < 60 * 1000;
        }
        return false;
    }

    protected shutUpYouRRetard(msg: Message): void {
        const shutRetard = ['Стягнув', 'Ти такий розумний', 'Помовчи трохи', 'Т-с-с-с-с-с-с',
            'Біжи далеко', 'Ти можеш трохи тихо побути?', 'Ціхо', 'Каца!', 'Таааась тась тась',
            'Люди, йдіть сі подивіть', 'Інколи краще жувати', 'Ти то серйозно?', 'Молодець'];
        msg.reply(shutRetard[Math.floor(Math.random() * shutRetard.length)]);
    }

    protected retardPlusPlus(msg: Message): void {
        const authorId = msg.author.id;
        if (!CommandBase.retardMap.get(authorId)) {
            CommandBase.retardMap.set(authorId, []);
        }
        const retardCount = CommandBase.retardMap.get(authorId);
        retardCount.push(new Date().getTime());
        if (retardCount.length > 3) {
            if (this.isRetard(authorId)) {
                (this.client.channels.find('type', 'text') as any).send('@everyone Чат, небезпека - розумововідсталий!');
            } else {
                retardCount.shift();
            }
        }
        console.log('retard++');
    }
}

export interface IProcessor {
    process(message: Message): void;
}
