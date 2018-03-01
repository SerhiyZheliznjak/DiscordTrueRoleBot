export default class Constants {
    public static get OBJECTIVE_FB(): string { return 'CHAT_MESSAGE_FIRSTBLOOD'; }
    public static get JUNGLE_TARGETS_IDENTIFIER(): string { return 'npc_dota_neutral'; }
    public static get DIRE_TOWER_TARGET_IDENTIFIER(): string { return 'npc_dota_badguys_tower'; }
    public static get RADIANT_TOWER_TARGET_IDENTIFIER(): string { return 'npc_dota_goodguys_tower'; }
    public static get MONGODB_URI(): string { return process.env.MONGODB_URI; }
    public static get MONGODB_DB_NAME(): string { return process.env.MONGODB_URI.split('/').pop(); }
    public static get RECENT_MATCHES_COLLECTION(): string { return 'recentmatches'; }
    public static get PLAYERS_COLLECTION(): string { return 'players'; }
    public static get HALL_OF_FAME_COLLECTION(): string { return 'halloffame'; }
    public static get UNCLAIMED(): number { return 0; }
    public static get WON(): string { return 'ЗАТАЩИВ'; }
    public static get LOST(): string { return 'ТІМА ДНО'; }
    public static get AM_HP(): number { return 640; }
    public static get WINNING_MATCH_ID(): string { return '686'; }
    public static get FORGIVE_RETARDS_INTERVAL(): number { return 1000 * 60 * 60 * 24; }
    public static get NOMINATION_DUE_INTERVAL(): number { return 1000 * 60 * 60 * 24 * 7 - 1000 * 60; } // - huge gap for calculations time
    public static get MATCH_DUE_TIME_SEC(): number { return 60 * 60 * 24 * 7 * 2; } // two weeks
    public static get WATCH_INTERVAL(): number { return 1000 * 60 * 60 * 24; }
}
