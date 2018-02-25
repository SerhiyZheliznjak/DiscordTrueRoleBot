import { NominationJson } from "./NominationJson";

export default class NominationWinnerJson {
    constructor(public account_id: number, public nomination: NominationJson) { }
}