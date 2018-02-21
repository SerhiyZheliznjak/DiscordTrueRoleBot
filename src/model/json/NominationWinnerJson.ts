import { NominationJson } from "./NominationJson";

export default class NominationWinnerJson {
    constructor(public account_id: string, public nomination: NominationJson) { }
}