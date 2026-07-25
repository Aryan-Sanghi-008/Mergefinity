/**
 * @file board.types.ts
 * @layer types
 * @description Board helper result types.
 */

import type { CellValue } from './game.types';

/** Per-tile movement within a single left-shifted row. */
export interface RowTileMove {
  /** Source column before the shift. */
  fromCol: number;
  /** Destination column after the shift. */
  toCol: number;
  /** Value that occupies `toCol` after the shift (merged value if merged). */
  value: CellValue;
  /** True when this tile participated in a merge at `toCol`. */
  merged: boolean;
}

/** Result of shifting and merging a single row leftward. */
export interface ShiftRowResult {
  /** Row after slide + merge, length `BOARD_SIZE`. */
  row: CellValue[];
  /** Score points produced by merges in this row. */
  delta: number;
  /** Column-local moves for animation mapping. */
  moves: RowTileMove[];
}
