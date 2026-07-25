/**
 * @file board.constants.ts
 * @layer constants
 * @description Board dimensions, win value, and spawn weights.
 */

export const BOARD_SIZE = 4 as const;
export const CELL_COUNT = BOARD_SIZE * BOARD_SIZE;
export const WIN_VALUE = 2048 as const;
export const SPAWN_VALUES = [2, 4] as const;
export const SPAWN_WEIGHT_2 = 0.9;
export const TILE_SIZE = 72;
export const TILE_GAP = 8;
export const BOARD_PADDING = 12;
export const MAX_UNDO_HISTORY = 5;
