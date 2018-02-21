import { Point } from "./Point";

export class Nomination {
    protected scorePoint(match, player_slot: number): string | number {
        return null;
    }
    protected name: string;
    protected minScore: number;
    protected msg: string;

    constructor(protected points?: Point[]) {
        this.points = !points ? [] : points;
    }
    public getName() {
        return this.name
    }
    public scoreMatch(match, player_slot) {
        this.addPoint(match.match_id, this.scorePoint(match, player_slot));
    }
    public addPoint(match_id: string, point) {
        this.points.push(new Point(match_id, point));
        while (this.points.length > 20) {
            this.points.shift();
        }
    }
    public getPoints() {
        return this.points;
    }
    public getScore(): number {
        return this.points.reduce((r, p) => {
            return p != null && p.point != null ? r + (p.point as number) : r;
        }, 0);
    }
    public getScoreText(): string {
        return '' + this.getScore();
    }
    public getMessage() {
        return this.msg;
    }
    // public isCorrupted() {
    //     return this._points.every(point => point.point === null);
    // }
    // public getMinScore() {
    //     return this._minScore;
    // }
    public hasHigherScoreThen(that) {
        return this.getScore() > that.getScore();
    }
    public isMyScoreHigher(scoreString) {
        return this.getScore() > parseInt(scoreString);
    }
    public isScored() {
        return this.getScore() > this.minScore;
    }
}