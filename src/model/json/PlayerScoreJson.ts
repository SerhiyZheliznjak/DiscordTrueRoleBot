import { NominationJson } from "./NominationJson";

export default class PlayerScoreJson {
    account_id: string;
    recentMatchesIds: string[];
    nominations: NominationJson[];
}