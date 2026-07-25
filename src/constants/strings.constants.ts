/**
 * @file strings.constants.ts
 * @layer constants
 * @description All user-visible Mergefinity UI copy (40+ keys).
 */

/** User-visible strings — no UI copy outside this object. */
export const STRINGS = {
  // Brand / chrome
  GAME_TITLE: 'Mergefinity',
  SCORE_LABEL: 'SCORE',
  BEST_LABEL: 'BEST',
  SCORE_DELTA_PREFIX: '+',
  NEW_GAME: 'New Game',
  UNDO: 'Undo',
  SWIPE_HINT: 'Swipe to move tiles',

  // Tabs
  TAB_GAME: 'Play',
  TAB_STATISTICS: 'Statistics',
  TAB_ACHIEVEMENTS: 'Achievements',
  TAB_SETTINGS: 'Settings',

  // Overlays
  GAME_OVER_TITLE: 'Game Over',
  GAME_OVER_SUB: 'No more moves available.',
  WIN_TITLE: 'You Win',
  WIN_SUB: 'You reached 2048.',
  CONTINUE: 'Keep Going',
  TRY_AGAIN: 'Try Again',
  RESTART_CONFIRM_TITLE: 'Start a new game?',
  RESTART_CONFIRM_SUB: 'Your current board will be lost.',
  CONFIRM: 'Confirm',
  CANCEL: 'Cancel',

  // Modes
  MODE_CLASSIC: 'Classic',
  MODE_ENDLESS: 'Endless',
  MODE_CHALLENGE: 'Challenge',
  MODE_TIME_ATTACK: 'Time Attack',
  MODE_SWITCH_CONFIRM: 'Switch mode and restart?',
  MODE_SWITCH_CONFIRM_SUB: 'Your current board and score will be lost.',
  TIME_UP_TITLE: "Time's Up",
  TIME_UP_SUB: 'Your final score is locked in.',
  TIMER_LABEL: 'Time',

  // Settings
  SETTINGS_TITLE: 'Settings',
  SETTINGS_SECTION_THEME: 'Theme',
  SETTINGS_SECTION_GAMEPLAY: 'Gameplay',
  SETTINGS_SECTION_INFO: 'Info',
  SETTINGS_CURRENT_THEME: 'Current theme',
  SETTINGS_SYSTEM_DARK: 'Match system dark mode',
  SETTINGS_HAPTICS: 'Haptics',
  SETTINGS_SOUND: 'Sound',
  SETTINGS_UNDO_LIMIT: 'Undo limit',
  SETTINGS_ON: 'On',
  SETTINGS_OFF: 'Off',
  SETTINGS_RATE_APP: 'Rate app',
  SETTINGS_PRIVACY: 'Privacy policy',
  SETTINGS_LICENSES: 'Licenses',
  SETTINGS_VERSION: 'Version',
  SETTINGS_PLACEHOLDER: 'Settings coming in a later phase.',
  SETTINGS_RESET_STATS: 'Reset statistics',
  SETTINGS_RESET_STATS_CONFIRM_TITLE: 'Reset statistics?',
  SETTINGS_RESET_STATS_CONFIRM: 'Clear all statistics? Best scores are kept.',

  // Themes
  THEMES_TITLE: 'Themes',
  THEME_CLASSIC: 'Classic',
  THEME_DARK: 'Dark',
  THEME_MIDNIGHT: 'Midnight',
  THEME_OBSIDIAN: 'Obsidian',
  THEME_IVORY: 'Ivory',
  THEME_LOCKED_IAP: 'Unlock with purchase',
  THEME_SELECTED: 'Selected',
  THEME_LAB_TITLE: 'Theme lab',
  THEME_LAB_HINT: 'Tap a theme to swap tokens live.',
  THEME_LAB_OPEN: 'Open theme lab',
  THEME_OPEN_PICKER: 'Choose theme',
  THEME_PREVIEW_HINT: 'Previewing premium theme…',
  PURCHASE_THEMES_TITLE: 'Premium themes',
  PURCHASE_THEMES_BODY:
    'Unlock Obsidian and Ivory. This stub confirms purchase for testing until store billing ships.',
  PURCHASE_THEMES_CONFIRM: 'Unlock themes',
  A11Y_THEME_SELECTED: 'selected',
  A11Y_THEME_LOCKED: 'locked, in-app purchase',
  A11Y_THEME_APPLY: 'double tap to apply',

  // Statistics
  STATS_TITLE: 'Statistics',
  STATS_GAMES_PLAYED: 'Games played',
  STATS_WINS: 'Wins',
  STATS_LOSSES: 'Losses',
  STATS_WIN_RATE: 'Win rate',
  STATS_BEST_SCORE: 'Best score',
  STATS_BEST_TILE: 'Best tile',
  STATS_TOTAL_MERGES: 'Total merges',
  STATS_AVERAGE_SCORE: 'Average score',
  STATS_EMPTY: 'Play a game in this mode to see stats.',
  STATS_SESSION_HISTORY: 'Recent games',
  STATS_ALL_TIME_BEST: 'All-time best',
  STATS_TOTAL_GAMES: 'Total games',
  STATS_PLAY_TIME: 'Play time (min)',
  STATS_CURRENT_WIN_STREAK: 'Win streak',
  STATS_LONGEST_WIN_STREAK: 'Longest win streak',
  STATS_CURRENT_PLAY_STREAK: 'Play streak (days)',
  STATS_LONGEST_PLAY_STREAK: 'Longest play streak',
  STATS_MERGE_HISTOGRAM: 'Merges by tile',
  STATS_WIN_RATE_SUFFIX: '%',
  STATS_SESSION_SCORE: 'Score',
  STATS_SESSION_TILE: 'Best tile',
  STATS_LIFETIME_SECTION: 'Lifetime',
  // Achievements
  ACHIEVEMENTS_TITLE: 'Achievements',
  ACHIEVEMENTS_PROGRESS: 'Unlocked',
  ACHIEVEMENT_LOCKED: 'Locked',
  ACHIEVEMENT_UNLOCKED: 'Unlocked',
  ACHIEVEMENT_PROGRESS_OF: '/',

  ACH_FIRST_WIN_NAME: 'First Win',
  ACH_FIRST_WIN_DESC: 'Reach the 2048 tile.',
  ACH_HALFWAY_THERE_NAME: 'Halfway There',
  ACH_HALFWAY_THERE_DESC: 'Reach the 1024 tile.',
  ACH_DOUBLE_DOWN_NAME: 'Double Down',
  ACH_DOUBLE_DOWN_DESC: 'Reach the 4096 tile.',
  ACH_LEGENDARY_NAME: 'Legendary',
  ACH_LEGENDARY_DESC: 'Reach the 8192 tile.',
  ACH_THE_SUMMIT_NAME: 'The Summit',
  ACH_THE_SUMMIT_DESC: 'Reach the 131072 tile.',

  ACH_QUICK_VICTORY_NAME: 'Quick Victory',
  ACH_QUICK_VICTORY_DESC: 'Reach 2048 in under 3 minutes.',
  ACH_BLITZ_NAME: 'Blitz',
  ACH_BLITZ_DESC: 'Make 100 moves in Time Attack.',
  ACH_SPEED_DEMON_NAME: 'Speed Demon',
  ACH_SPEED_DEMON_DESC: 'Score over 20,000 in Time Attack.',

  ACH_PURIST_NAME: 'Purist',
  ACH_PURIST_DESC: 'Reach 2048 without using undo.',
  ACH_EFFICIENT_NAME: 'Efficient',
  ACH_EFFICIENT_DESC: 'Reach 2048 in under 150 moves.',
  ACH_CORNER_MASTER_NAME: 'Corner Master',
  ACH_CORNER_MASTER_DESC: 'Reach 2048 with that tile in a corner.',

  ACH_CENTURY_CLUB_NAME: 'Century Club',
  ACH_CENTURY_CLUB_DESC: 'Play 100 games.',
  ACH_COMMITTED_NAME: 'Committed',
  ACH_COMMITTED_DESC: 'Play 7 days in a row.',
  ACH_VETERAN_NAME: 'Veteran',
  ACH_VETERAN_DESC: 'Play 500 games.',
  ACH_UNSTOPPABLE_NAME: 'Unstoppable',
  ACH_UNSTOPPABLE_DESC: 'Win 10 games in a row.',

  ACH_CHALLENGE_ACCEPTED_NAME: 'Challenge Accepted',
  ACH_CHALLENGE_ACCEPTED_DESC: 'Win Challenge mode.',
  ACH_AGAINST_THE_CLOCK_NAME: 'Against the Clock',
  ACH_AGAINST_THE_CLOCK_DESC: 'Finish a Time Attack run.',
  ACH_ALL_ROUNDER_NAME: 'All-Rounder',
  ACH_ALL_ROUNDER_DESC: 'Win Classic, Challenge, Time Attack, and reach 4096 in Endless.',

  ACH_THE_BEGINNING_NAME: 'The Beginning',
  ACH_THE_BEGINNING_DESC: 'Play your first game.',
  ACH_COMEBACK_NAME: 'Comeback',
  ACH_COMEBACK_DESC: 'Win after 3 consecutive losses.',

  // Status
  STATUS_WIN: 'Win',
  STATUS_LOSS: 'Loss',
  STATUS_STREAK: 'Streak',
  LOADING: 'Loading',

  // A11y (TalkBack)
  A11Y_SETTINGS: 'Settings',
  A11Y_UNDO: 'Undo',
  A11Y_NEW_GAME: 'New game',
  A11Y_BOARD: 'Game board',
  A11Y_EMPTY_CELL: 'Empty',
  A11Y_BACK: 'Back',
} as const;

/** Keys of `STRINGS`. */
export type StringKey = keyof typeof STRINGS;
