import Pair from "../Pair";

export class NominationJson {
    constructor(public name: string, public points: Pair<string, string | number>[]) {
    }
}

