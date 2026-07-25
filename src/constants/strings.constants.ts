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
