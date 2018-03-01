import { IDBKey } from "./IDBKey";

export default class PlayerRecentMatchesJson implements IDBKey {
    public key;
    constructor(public account_id: number, public recentMatchesIds: number[]) {
        this.key = this.account_id;
    }
}
