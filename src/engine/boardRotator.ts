/**
 * @file boardRotator.ts
 * @layer engine
 * @description Clockwise board and index rotation helpers.
 */

import { BOARD_SIZE, QUARTER_TURNS } from '@/constants';
import type { Board, CellValue } from '@/types';

/**
 * Normalizes a rotation count into `[0, QUARTER_TURNS)`.
 * @param times - Requested clockwise quarter-turns (may be negative)
 */
export function normalizeRotations(times: number): number {
  return ((times % QUARTER_TURNS) + QUARTER_TURNS) % QUARTER_TURNS;
}

/**
 * Maps a flat board index through `times` clockwise 90° rotations.
 * @param index - Flat index on a `BOARD_SIZE`² board
 * @param times - Clockwise quarter-turns
 * @returns Transformed flat index
 */
export function rotateIndex(index: number, times: number): number {
  let current = index;
  const rotations = normalizeRotations(times);

  for (let t = 0; t < rotations; t += 1) {
    const row = Math.floor(current / BOARD_SIZE);
    const col = current % BOARD_SIZE;
    current = col * BOARD_SIZE + (BOARD_SIZE - 1 - row);
  }

  return current;
}

/**
 * Rotates the board 90° clockwise `times` times.
 * @param board - Source board
 * @param times - Number of 90° clockwise rotations
 * @returns Newly allocated rotated board
 */
export function rotateBoard(board: Readonly<Board>, times: number): Board {
  let current = [...board] as Board;
  const rotations = normalizeRotations(times);

  for (let t = 0; t < rotations; t += 1) {
    const rotated = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, () => 0 as CellValue);
    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        const source = current[(BOARD_SIZE - 1 - col) * BOARD_SIZE + row]!;
        rotated[row * BOARD_SIZE + col] = source;
      }
    }
    current = rotated;
  }

  return current;
}
