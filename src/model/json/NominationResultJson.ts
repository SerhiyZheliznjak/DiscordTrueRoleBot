import { IDBKey } from "./IDBKey";

export default class NominationResultJson implements IDBKey {
    public key;
    constructor(public nominationName: string, public owner_account_id: number, public score: number, public timeClaimed: number) {
        this.key = nominationName;
    }
}
