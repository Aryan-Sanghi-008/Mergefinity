/**
 * @file layout.constants.ts
 * @layer constants
 * @description Spacing and border-radius tokens.
 */

import { BOARD_RADIUS_DP, TILE_RADIUS_DP } from './board.constants';

/** Global spacing scale in dp. */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

/**
 * Corner radii aligned with P-00 board treatment.
 * Tile elevation remains 0 (no drop shadows on tiles).
 */
export const RADII = {
  tile: TILE_RADIUS_DP,
  board: BOARD_RADIUS_DP,
  btn: 4,
  card: 12,
} as const;
