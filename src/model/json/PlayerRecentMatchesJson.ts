import { NominationJson } from "./NominationJson";

export default class PlayerRecentMatchesJson {
    constructor(public account_id: number, public recentMatchesIds: number[]) { }
}
