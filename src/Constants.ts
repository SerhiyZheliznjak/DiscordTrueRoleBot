export class Constants {
    public static get OBJECTIVE_FB() { return 'CHAT_MESSAGE_FIRSTBLOOD'; }
    public static get JUNGLE_TARGETS_IDENTIFIER() { return 'npc_dota_neutral'; }
    public static get DIRE_TOWER_TARGET_IDENTIFIER() { return 'npc_dota_badguys_tower'; }
    public static get RADIANT_TOWER_TARGET_IDENTIFIER() { return 'npc_dota_goodguys_tower'; }
    public static get RECENT_MATCHES() { return './storage/recent-matches.json'; }
    public static get PLAYERS_FILE_PATH() { return './storage/players.json'; }
    public static get WINNERS_FILE_PATH() { return './storage/winners.json'; }
    public static get UNCLAIMED() { return 0; }
    public static get WON() { return 'ЗАТАЩИВ'; }
    public static get LOST() { return 'ТІМА ДНО'; }
    public static get AM_HP() { return 640; }
    public static get WINNING_MATCH_ID() { return '686'; }
    public static get FORGIVE_RETARDS_INTERVAL() { return 1000 * 60 * 60 * 24; }
    public static get NOMINATION_DUE_INTERVAL() { return 1000 * 60 * 60 * 24 * 7 - 1000 * 60; } // -1000*60 huge gap for calculations
    public static get MATCH_DUE_TIME_SEC() { return 60 * 60 * 24 * 7; } // -1000*60 huge gap for calculations
    public static get WATCH_INTERVAL() { return 1000 * 60 * 60 * 24; }
}
