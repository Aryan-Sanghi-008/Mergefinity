/**
 * @file storage.constants.ts
 * @layer constants
 * @description AsyncStorage key names for Mergefinity persistence.
 */

export const STORAGE_KEYS = {
  GAME_STATE: 'mergefinity:game_state',
  BEST_SCORE: 'mergefinity:best_score',
  SETTINGS: 'mergefinity:settings',
  THEME: 'mergefinity:theme',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
