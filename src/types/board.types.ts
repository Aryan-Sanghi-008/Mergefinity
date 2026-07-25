/**
 * @file board.types.ts
 * @layer types
 * @description Board helper result types.
 */

import type { CellValue } from './game.types';

/** Result of shifting and merging a single row leftward. */
export interface ShiftRowResult {
  row: CellValue[];
  delta: number;
}
