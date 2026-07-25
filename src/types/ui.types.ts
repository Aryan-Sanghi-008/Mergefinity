/**
 * @file ui.types.ts
 * @layer types
 * @description UI-facing unions for icons, overlays, and navigation chrome.
 */

import type { CellValue } from './game.types';

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

/** Visual tile motion phase for Reanimated coordination (P-07). */
export type TileMotionPhase = 'idle' | 'slide' | 'merge' | 'spawn' | 'exit';

/**
 * UI-layer tile entity with stable identity across moves.
 * Engine boards stay as `CellValue[]`; this map drives AnimatedTile keys.
 */
export interface BoardTileEntity {
  /** Stable id for React keys and shared values. */
  id: string;
  /** Current (destination) flat cell index. */
  index: number;
  /** Flat cell index before the active slide (equals `index` when idle). */
  fromIndex: number;
  /** Display value (pre-merge during slide; post-merge after). */
  value: CellValue;
  /** Current motion phase. */
  phase: TileMotionPhase;
  /** True when this tile is the merge survivor (plays pop). */
  isMergeSurvivor: boolean;
  /** True when this tile is a merge victim (removed after slide). */
  isMergeVictim: boolean;
  /** True when this tile just spawned. */
  isSpawn: boolean;
  /** Bumped to retrigger Reanimated sequences. */
  motionSeq: number;
}
