/**
 * @file boardUtils.ts
 * @layer engine
 * @description Pure board helpers — empty board, empty cells, spawn, clone.
 */

import {
  BOARD_SIZE,
  SPAWN_TILE_2,
  SPAWN_TILE_4,
  SPAWN_WEIGHT_2,
} from '@/constants';
import type { Board, CellValue } from '@/types';

/**
 * Creates an empty square board filled with zeros.
 * @param boardSize - Cells per axis (default Classic 4)
 */
export function createEmptyBoard(boardSize: number = BOARD_SIZE): Board {
  const cellCount = boardSize * boardSize;
  return Array.from({ length: cellCount }, () => 0 as CellValue);
}

/**
 * Returns flat indices of all empty cells.
 * @param board - Current board (read-only)
 */
export function getEmptyCells(board: Readonly<Board>): number[] {
  return board.flatMap((value, index) => (value === 0 ? [index] : []));
}

/**
 * Deep-clones a board so callers never share mutable references.
 * @param board - Source board
 */
export function cloneBoard(board: Readonly<Board>): Board {
  return structuredClone(board) as Board;
}

/**
 * Spawns a 2 (90%) or 4 (10%) into a random empty cell.
 * @param board - Current board (not mutated)
 * @param rng - Injected RNG in [0, 1); defaults to Math.random
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
