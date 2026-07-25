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
 * @param index - Flat index on an `boardSize`² board
 * @param times - Clockwise quarter-turns
 * @param boardSize - Cells per axis
 */
export function rotateIndex(
  index: number,
  times: number,
  boardSize: number = BOARD_SIZE,
): number {
  let current = index;
  const rotations = normalizeRotations(times);

  for (let t = 0; t < rotations; t += 1) {
    const row = Math.floor(current / boardSize);
    const col = current % boardSize;
    current = col * boardSize + (boardSize - 1 - row);
  }

  return current;
}

/**
 * Rotates the board 90° clockwise `times` times.
 * @param board - Source board
 * @param times - Number of 90° clockwise rotations
 * @param boardSize - Cells per axis
 */
export function rotateBoard(
  board: Readonly<Board>,
  times: number,
  boardSize: number = BOARD_SIZE,
): Board {
  let current = [...board] as Board;
  const rotations = normalizeRotations(times);
  const cellCount = boardSize * boardSize;

  for (let t = 0; t < rotations; t += 1) {
    const rotated = Array.from({ length: cellCount }, () => 0 as CellValue);
    for (let row = 0; row < boardSize; row += 1) {
      for (let col = 0; col < boardSize; col += 1) {
        const source = current[(boardSize - 1 - col) * boardSize + row]!;
        rotated[row * boardSize + col] = source;
      }
    }
    current = rotated;
  }

  return current;
}
