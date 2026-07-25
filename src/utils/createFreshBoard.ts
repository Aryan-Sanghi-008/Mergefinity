/**
 * @file createFreshBoard.ts
 * @layer utils
 * @description Opening board helper for store restart / initial state.
 */

import { createEmptyBoard, spawnTile } from '@/engine';
import type { Board } from '@/types';

/**
 * Classic opening: empty board + two spawned tiles.
 * @param rng - Injected RNG (defaults to Math.random)
 */
export function createFreshBoard(rng: () => number = Math.random): Board {
  let board = createEmptyBoard();
  board = spawnTile(board, rng);
  board = spawnTile(board, rng);
  return board;
}
