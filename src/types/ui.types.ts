/**
 * @file ui.types.ts
 * @layer types
 * @description UI-facing unions for icons, overlays, and navigation chrome.
 */

/** Constrained icon glyph names for IconButton (assets mapped later). */
export type IconName =
  | 'settings'
  | 'undo'
  | 'restart'
  | 'back'
  | 'check'
  | 'lock'
  | 'stats'
  | 'achievements'
  | 'theme';

/** Full-screen / modal overlay kinds on the game screen. */
export type OverlayKind = 'none' | 'win' | 'gameOver' | 'restartConfirm';

/** Primary bottom-tab destinations (P-14). */
export type TabName = 'game' | 'statistics' | 'achievements';

/** Settings section keys for layout grouping. */
export type SettingsSection = 'theme' | 'gameplay' | 'info';
