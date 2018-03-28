import Pair from "./Pair";
import { MatchJson } from "../dota-api/DotaJsonTypings";

export default class Nomination {
    protected name: string;
    protected minScore: number;
    protected msg: string;

    constructor(
        protected points: Array<Pair<number, string | number>> = [],
        public timeClaimed: number = new Date().getTime()
    ) { }

    public getKey(): number {
        return this.name.split("").reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
    }

    public getName(): string {
        return this.name;
    }

    public scoreMatch(match: MatchJson, player_slot: number): void {
        this.addPoint(match.match_id, this.scorePoint(match, player_slot));
    }
    public addPoint(match_id: number, point: string | number) {
        this.points.push(new Pair(match_id, point));
        while (this.points.length > 20) {
            this.points.shift();
        }
    }
    public getPoints(): Array<Pair<number, string | number>> {
        return this.points;
    }
    public getScore(): number {
        return this.points.reduce((r, p) => {
            return p != null && p.p2 != null ? r + parseInt(p.p2 + '') : r;
        }, 0);
    }

    public scoreToString(): string {
        return this.getScore() + '';
    }

    public getMessage(): string {
        return this.msg;
    }
    public compare(that: Nomination): number {
        return that.getScore() - this.getScore();
    }
    public isScored(): boolean {
        return this.getScore() >= this.minScore;
    }

    public getScoreText(): string {
        throw new Error('Should be implemented by child classes');
    }

    public getScoreDescription(): string {
        throw new Error('Should be implemented by child classes');
    }

    public getThumbURL(): string {
        throw new Error('Should be implemented by child classes');
    }

    public scorePoint(match: MatchJson, player_slot: number): string | number {
        throw new Error('Should be implemented by child classes');
    }
}
