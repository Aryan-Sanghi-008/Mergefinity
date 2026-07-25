/**
 * @file moveResolver.ts
 * @layer engine
 * @description Pure function that resolves a swipe direction into a new board state
 *              via rotation + left-shift. No React, no side effects, no async.
 */

import { BOARD_SIZE } from '@/constants';
import type { Board, CellValue, Direction, MoveResult } from '@/types';

import { shiftRowLeft } from './boardUtils';

/** Pre/post clockwise 90° rotation counts so every direction becomes a left shift. */
const DIR_ROTATIONS: Record<Direction, readonly [number, number]> = {
  LEFT: [0, 0],
  RIGHT: [2, 2],
  UP: [3, 1],
  DOWN: [1, 3],
};

/**
 * Rotates the board 90° clockwise `times` times.
 * @param board - Source board
 * @param times - Number of 90° clockwise rotations
 * @returns Newly allocated rotated board
 */
export function rotateBoard(board: Readonly<Board>, times: number): Board {
  let current = [...board] as Board;
  const rotations = ((times % 4) + 4) % 4;

  for (let t = 0; t < rotations; t += 1) {
    const rotated = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, () => 0 as CellValue);
    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        const source = current[(BOARD_SIZE - 1 - col) * BOARD_SIZE + row];
        rotated[row * BOARD_SIZE + col] = source ?? 0;
      }
    }
    current = rotated;
  }

  return current;
}

/**
 * Resolves a swipe in the given direction.
 * @param board - Current board (read-only)
 * @param dir - Player's swipe direction
 * @returns MoveResult with new board, score delta, and whether the board changed
 */
export function resolveMove(board: Readonly<Board>, dir: Direction): MoveResult {
  const rotations = DIR_ROTATIONS[dir];
  const pre = rotations[0];
  const post = rotations[1];

  const rotated = rotateBoard(board, pre);

  let delta = 0;
  const shifted: CellValue[] = [];

  for (let rowStart = 0; rowStart < rotated.length; rowStart += BOARD_SIZE) {
    const row = rotated.slice(rowStart, rowStart + BOARD_SIZE) as CellValue[];
    const { row: nextRow, delta: rowDelta } = shiftRowLeft(row);
    delta += rowDelta;
    shifted.push(...nextRow);
  }

  const result = rotateBoard(shifted as Board, post);
  const boardChanged = result.some((value, index) => value !== board[index]);

  return {
    board: result,
    scoreDelta: delta,
    tileMoves: [],
    boardChanged,
  };
}
