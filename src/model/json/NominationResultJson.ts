import { IDBKey } from "./IDBKey";

export default class NominationResultJson implements IDBKey {
    constructor(
        public key: number,
        public nominationName: string,
        public owner_account_id: number,
        public score: number,
        public timeClaimed: number
    ) { }
}
