import { IDBKey } from "./IDBKey";

export default class RegisteredPlayerJson implements IDBKey {
    public key;
    constructor(public account_id: number, public discordId: string) {
        this.key = account_id;
    }
}
