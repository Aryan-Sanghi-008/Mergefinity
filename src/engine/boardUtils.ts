/**
 * @file boardUtils.ts
 * @layer engine
 * @description Pure board helpers — empty board, empty cells, spawn, clone.
 *              No React, no side effects, no async.
 */

import {
  CELL_COUNT,
  SPAWN_TILE_2,
  SPAWN_TILE_4,
  SPAWN_WEIGHT_2,
} from '@/constants';
import type { Board, CellValue } from '@/types';

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
 * Deep-clones a board so callers never share mutable references.
 * @param board - Source board
 * @returns Independent board copy
 */
export function cloneBoard(board: Readonly<Board>): Board {
  return structuredClone(board) as Board;
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
    return cloneBoard(board);
  }

  const rawPick = Math.floor(rng() * empty.length);
  const indexPick = Math.min(Math.max(rawPick, 0), empty.length - 1);
  const cellIndex = empty[indexPick]!;

  const value: CellValue = rng() < SPAWN_WEIGHT_2 ? SPAWN_TILE_2 : SPAWN_TILE_4;
  const next = cloneBoard(board);
  next[cellIndex] = value;
  return next;
}
