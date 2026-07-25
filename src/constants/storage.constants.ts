/**
 * @file storage.constants.ts
 * @layer constants
 * @description Namespaced AsyncStorage keys for all persisted slices.
 */

/** All AsyncStorage key strings used by Mergefinity. */
export const STORAGE_KEYS = {
  GAME_STATE: 'mergefinity:game_state',
  BEST_SCORE: 'mergefinity:best_score',
  BEST_SCORES_BY_MODE: 'mergefinity:best_scores_by_mode',
  SETTINGS: 'mergefinity:settings',
  THEME: 'mergefinity:theme',
  STATS: 'mergefinity:stats',
  LIFETIME_STATS: 'mergefinity:lifetime_stats',
  SESSION_HISTORY: 'mergefinity:session_history',
  ACHIEVEMENTS: 'mergefinity:achievements',
  UNLOCKED_THEMES: 'mergefinity:unlocked_themes',
  IAP_ENTITLEMENTS: 'mergefinity:iap_entitlements',
  ONBOARDING_COMPLETE: 'mergefinity:onboarding_complete',
} as const;

/** Union of all storage key string values. */
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
