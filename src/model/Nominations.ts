import { MaxDamageHit } from "./nominations/MaxDamageHit";
import { FirstBloodOwner } from "./nominations/FirstBloodOwner";
import { Donor } from "./nominations/Donor";
import { JungleOppressor } from "./nominations/JungleOppressor";
import { RapunzelSyndrome } from "./nominations/RapunzelSyndrome";
import { MotherOfGod } from "./nominations/MotherOfGod";
import { OponentOwsMoney } from "./nominations/OponentOwsMoney";
import { StackGod } from "./nominations/StackGod";
import { Parkinson } from "./nominations/Parkinson";
import { BestKDA } from "./nominations/BestKDA";
import { WinnerForLife } from "./nominations/WinnerForLife";
import { Looser } from "./nominations/Looser";
import { PingMaster } from "./nominations/PingMaster";
import Nomination from "./Nomination";
import { ChickeSoupLover } from "./nominations/ChickenSoupLover";
import { DenyGod } from "./nominations/DenyGod";
import { Nenza } from "./nominations/Nenza";
import { StunningMan } from "./nominations/StunningMan";
import { TacticalFeeder } from "./nominations/TacticalFeeder";
import { ThisTimeItWillWork } from "./nominations/ThisTimeItWillWork";

export default class Nominations {
    public static get all(): Nomination[] {
        return [
            new MaxDamageHit(),
            new FirstBloodOwner(),
            new Donor(),
            new JungleOppressor(),
            new RapunzelSyndrome(),
            new MotherOfGod(),
            new OponentOwsMoney(),
            new StackGod(),
            new Parkinson(),
            new BestKDA(),
            new WinnerForLife(),
            new Looser(),
            new PingMaster(),
            new ChickeSoupLover(),
            new DenyGod(),
            new Nenza(),
            new StunningMan(),
            new TacticalFeeder(),
            new ThisTimeItWillWork()
        ];
    }
}
