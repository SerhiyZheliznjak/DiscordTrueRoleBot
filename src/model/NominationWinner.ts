import { Nomination } from "./Nomination";

export default class NominationWinner {
    constructor(public account_id: number, public nomination: Nomination) { }
}