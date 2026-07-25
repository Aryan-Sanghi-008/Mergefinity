/**
 * @file boardUtils.ts
 * @layer engine
 * @description Pure board helpers — empty board, empty cells, spawn, row shift.
 *              No React, no side effects, no async.
 */

import {
  BOARD_SIZE,
  CELL_COUNT,
  SPAWN_WEIGHT_2,
} from '@/constants';
import type { Board, CellValue, ShiftRowResult } from '@/types';

/**
 * Creates an empty 4x4 board filled with zeros.
 * @returns A new Board of length CELL_COUNT
 */
export function createEmptyBoard(): Board {
  return Array.from({ length: CELL_COUNT }, () => 0 as CellValue);
}

/**
 * Returns flat indices of all empty cells.
 * @param board - Current board (read-only)
 * @returns Array of empty cell indices
 */
export function getEmptyCells(board: Readonly<Board>): number[] {
  return board.flatMap((value, index) => (value === 0 ? [index] : []));
}

/**
 * Spawns a 2 (90%) or 4 (10%) into a random empty cell.
 * @param board - Current board (not mutated)
 * @param rng - Injected RNG in [0, 1); defaults to Math.random
 * @returns New board with one spawned tile, or a copy if no empty cells
 */
export function spawnTile(
  board: Readonly<Board>,
  rng: () => number = Math.random,
): Board {
  const empty = getEmptyCells(board);
  if (empty.length === 0) {
    return [...board] as Board;
  }

  const indexPick = Math.floor(rng() * empty.length);
  const cellIndex = empty[indexPick];
  if (cellIndex === undefined) {
    return [...board] as Board;
  }

  const value: CellValue = rng() < SPAWN_WEIGHT_2 ? 2 : 4;
  const next = [...board] as Board;
  next[cellIndex] = value;
  return next;
}

/**
 * Shifts and merges a single row leftward. Pure. O(n).
 * Equal adjacent tiles merge once; no chain-merges in a single pass.
 * @param row - Row of CELL values (length BOARD_SIZE)
 * @returns Shifted row and score delta from merges
 */
export function shiftRowLeft(row: readonly CellValue[]): ShiftRowResult {
  const filled = row.filter((v): v is Exclude<CellValue, 0> => v !== 0);
  let delta = 0;
  const merged: CellValue[] = [];

  let i = 0;
  while (i < filled.length) {
    const current = filled[i];
    const next = filled[i + 1];
    if (current !== undefined && next !== undefined && current === next) {
      const val = (current * 2) as CellValue;
      merged.push(val);
      delta += val;
      i += 2;
    } else if (current !== undefined) {
      merged.push(current);
      i += 1;
    } else {
      break;
    }
  }

  while (merged.length < BOARD_SIZE) {
    merged.push(0);
  }

  return { row: merged, delta };
}
