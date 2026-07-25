/**
 * @file rowShifter.ts
 * @layer engine
 * @description Left-shift + merge for a single board row.
 */

import { TILE_MERGE_FACTOR } from '@/constants';
import type { CellValue, RowTileMove, ShiftRowResult } from '@/types';

/**
 * Shifts and merges a single row leftward. Pure. O(n).
 * Equal adjacent tiles merge once; no chain-merges in a single pass.
 * @param row - Row of cell values (length BOARD_SIZE)
 * @returns Shifted row, score delta, and column-local tile moves
 */
export function shiftRowLeft(row: readonly CellValue[]): ShiftRowResult {
  const filled: { col: number; value: Exclude<CellValue, 0> }[] = [];
  for (let col = 0; col < row.length; col += 1) {
    const value = row[col];
    if (value !== undefined && value !== 0) {
      filled.push({ col, value });
    }
  }

  let delta = 0;
  const merged: CellValue[] = [];
  const moves: RowTileMove[] = [];
  let writeCol = 0;
  let i = 0;

  while (i < filled.length) {
    const current = filled[i]!;
    const next = filled[i + 1];

    if (next !== undefined && current.value === next.value) {
      const val = (current.value * TILE_MERGE_FACTOR) as CellValue;
      merged.push(val);
      delta += val;
      moves.push({
        fromCol: current.col,
        toCol: writeCol,
        value: val,
        merged: true,
      });
      moves.push({
        fromCol: next.col,
        toCol: writeCol,
        value: val,
        merged: true,
      });
      writeCol += 1;
      i += TILE_MERGE_FACTOR;
    } else {
      merged.push(current.value);
      moves.push({
        fromCol: current.col,
        toCol: writeCol,
        value: current.value,
        merged: false,
      });
      writeCol += 1;
      i += 1;
    }
  }

  while (merged.length < row.length) {
    merged.push(0);
  }

  return { row: merged, delta, moves };
}
