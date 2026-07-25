/**
 * @file board.constants.ts
 * @layer constants
 * @description Board dimensions, win value, spawn weights, and move rotations.
 */

import type { Direction } from '@/types';

/** Cells per board axis (Classic / Endless / Time Attack). */
export const BOARD_SIZE = 4 as const;

/** Total cells on a `BOARD_SIZE` × `BOARD_SIZE` board. */
export const CELL_COUNT = BOARD_SIZE * BOARD_SIZE;

/** Classic win tile value. */
export const WIN_VALUE = 2048 as const;

/** Common spawn tile value (weighted). */
export const SPAWN_TILE_2 = 2 as const;

/** Rare spawn tile value. */
export const SPAWN_TILE_4 = 4 as const;

/** Allowed spawn values. */
export const SPAWN_VALUES = [SPAWN_TILE_2, SPAWN_TILE_4] as const;

/** Probability of spawning a 2 (remainder spawns a 4). */
export const SPAWN_WEIGHT_2 = 0.9;

/** Merge doubles the paired tile value. */
export const TILE_MERGE_FACTOR = 2 as const;

/** Clockwise quarter-turns in a full rotation (used by rotateBoard). */
export const QUARTER_TURNS = 4 as const;

/**
 * Pre/post clockwise 90° rotation counts so every swipe direction becomes a left shift.
 * Tuple: `[preRotations, postRotations]`.
 */
export const DIR_ROTATIONS: Record<Direction, readonly [number, number]> = {
  LEFT: [0, 0],
  RIGHT: [2, 2],
  UP: [3, 1],
  DOWN: [1, 3],
};

/** Fallback tile edge length in dp before `useBoardDimensions`. */
export const TILE_SIZE = 72;

/**
 * Inner board padding in dp (P-02 / P-04).
 * @see BOARD_PADDING alias
 */
export const BOARD_PADDING_DP = 12;

/**
 * Gap between cells in density-independent px (P-00 visual identity).
 * @see TILE_GAP alias
 */
export const TILE_GAP_DP = 3;

/**
 * Tile corner radius in dp (P-00).
 * @see TILE_RADIUS alias
 */
export const TILE_RADIUS_DP = 8;

/** Board outer corner radius in dp (P-00). */
export const BOARD_RADIUS_DP = 10;

/** @deprecated Prefer `BOARD_PADDING_DP`. */
export const BOARD_PADDING = BOARD_PADDING_DP;

/** @deprecated Prefer `TILE_GAP_DP`. */
export const TILE_GAP = TILE_GAP_DP;

/** @deprecated Prefer `TILE_RADIUS_DP`. */
export const TILE_RADIUS = TILE_RADIUS_DP;

/**
 * Max undo snapshots retained per game (Classic / Endless default limit).
 * Challenge uses a lower runtime limit via mode config (P-10).
 */
export const MAX_UNDO_HISTORY = 3;
