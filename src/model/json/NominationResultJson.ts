import { IDBKey } from "./IDBKey";

export default class NominationResultJson implements IDBKey {
    public key: number;
    constructor(public nominationName: string, public owner_account_id: number, public score: number, public timeClaimed: number) {
        this.key = nominationName.split("").reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
    }
}
