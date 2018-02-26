import Pair from "../Pair";

export class NominationJson {
    constructor(public name: string, public points: Array<Pair<string, string | number>>) {
    }
}
