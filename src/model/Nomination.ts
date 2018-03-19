import Pair from "./Pair";
import { MatchJson } from "../dota-api/DotaJsonTypings";

export default class Nomination {
    public timeClaimed: number;
    protected name: string;
    protected minScore: number;
    protected msg: string;

    constructor(protected points: Array<Pair<string, string | number>> = []) {
        this.timeClaimed = new Date().getTime();
    }

    public getKey(): number {
        return this.name.split("").reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
    }

    public getName() {
        return this.name;
    }
    public scoreMatch(match, player_slot) {
        this.addPoint(match.match_id, this.scorePoint(match, player_slot));
    }
    public addPoint(match_id: string, point: string | number) {
        this.points.push(new Pair(match_id, point));
        while (this.points.length > 20) {
            this.points.shift();
        }
    }
    public getPoints() {
        return this.points;
    }
    public getScore(): number {
        return this.points.reduce((r, p) => {
            return p != null && p.p2 != null ? r + parseInt(p.p2 + '') : r;
        }, 0);
    }
    public getScoreText(): string {
        return '' + this.getScore();
    }
    public getMessage() {
        return this.msg;
    }
    public hasHigherScoreThen(that) {
        return this.getScore() > that.getScore();
    }
    public isScored(): boolean {
        return this.getScore() >= this.minScore;
    }
    protected scorePoint(match: MatchJson, player_slot: number): string | number {
        return null;
    }
}
