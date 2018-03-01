import Nominations from "../model/Nominations";
import Nomination from "../model/Nomination";

export default class NominationFactory {
    public static createByName(name: string): Nomination {
        return Nominations.all.find(nomination => nomination.getName() === name);
    }
}
