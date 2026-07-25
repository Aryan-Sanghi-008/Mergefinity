/**
 * @file createFreshBoard.ts
 * @layer utils
 * @description Opening board helper for store restart / initial state.
 */

import { BOARD_SIZE } from '@/constants';
import { createEmptyBoard, spawnTile } from '@/engine';
import type { Board } from '@/types';

/**
 * Opening board: empty N×N + two spawned tiles.
 * @param boardSize - Cells per axis
 * @param rng - Injected RNG (defaults to Math.random)
 */
export function createFreshBoard(
  boardSize: number = BOARD_SIZE,
  rng: () => number = Math.random,
): Board {
  let board = createEmptyBoard(boardSize);
  board = spawnTile(board, rng);
  board = spawnTile(board, rng);
  return board;
}
