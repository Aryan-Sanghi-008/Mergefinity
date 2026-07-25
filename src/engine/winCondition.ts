/**
 * @file winCondition.ts
 * @layer engine
 * @description Pure win and loss detection for Mergefinity.
 */

import { BOARD_SIZE, WIN_VALUE } from '@/constants';
import type { Board, CellValue } from '@/types';

import { getEmptyCells } from './boardUtils';

/**
 * Returns true when any cell has reached or exceeded `winValue`.
 * @param board - Current board
 * @param winValue - Target tile; `null` means no tile-based win (Endless / Time Attack)
 */
export function isWon(
  board: Readonly<Board>,
  winValue: CellValue | null = WIN_VALUE,
): boolean {
  if (winValue === null) {
    return false;
  }
  return board.some((value) => value >= winValue);
}

/**
 * Returns true when no empty cells remain and no adjacent equal pairs exist.
 * @param board - Current board
 * @param boardSize - Cells per axis
 */
export function isLost(
  board: Readonly<Board>,
  boardSize: number = BOARD_SIZE,
): boolean {
  if (getEmptyCells(board).length > 0) {
    return false;
  }

  for (let row = 0; row < boardSize; row += 1) {
    for (let col = 0; col < boardSize; col += 1) {
      const index = row * boardSize + col;
      const value = board[index];

      if (col + 1 < boardSize) {
        const right = board[index + 1];
        if (value === right) {
          return false;
        }
      }

      if (row + 1 < boardSize) {
        const below = board[index + boardSize];
        if (value === below) {
          return false;
        }
      }
    }
  }

  return true;
}
