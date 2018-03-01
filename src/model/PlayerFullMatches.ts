import { MatchJson } from "../dota-api/DotaJsonTypings";

export default class PlayerFullMatches {
    constructor(public account_id: number, public matches: MatchJson[]) { }
}
