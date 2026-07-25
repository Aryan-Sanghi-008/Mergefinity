/**
 * @file analytics.constants.ts
 * @layer constants
 * @description Analytics event names and rating prompt thresholds (P-20).
 */

/** Canonical Firebase Analytics event names. */
export const ANALYTICS_EVENTS = {
  GAME_START: 'game_start',
  GAME_OVER: 'game_over',
  WIN_ACHIEVED: 'win_achieved',
  TILE_REACHED: 'tile_reached',
  UNDO_USED: 'undo_used',
  THEME_CHANGED: 'theme_changed',
  IAP_INITIATED: 'iap_initiated',
  IAP_COMPLETED: 'iap_completed',
} as const;

/** Show the Play Store rating prompt after this many lifetime wins. */
export const RATING_PROMPT_AFTER_WINS = 3 as const;
