import { Nomination } from "../Nomination";
import { DotaParser } from "../../services/DotaParser";
import { Constants } from "../../Constants";
import { Point } from "../Point";

export class PingMaster extends Nomination {
    constructor(protected points?: Point[]) {
        super(points);
        this.name = 'Майстер Пінг';
        this.minScore = 100;
        this.msg = 'Нема такого що не можливо виразити пінгом';
    }

    protected scorePoint(match, player_slot) {
        if (!!match) {
            return DotaParser.getPlayerInfo(match, player_slot).pings;
        }
        return 0;
    }

    public getScore() {
        const pings = this.points.map(p => (p.point as number));
        return Math.max(...pings);
    }
}