/**
 * @file winCondition.ts
 * @layer engine
 * @description Pure win and loss detection for Mergefinity.
 */

import { BOARD_SIZE, WIN_VALUE } from '@/constants';
import type { Board } from '@/types';

import { getEmptyCells } from './boardUtils';

/**
 * Returns true when any cell has reached WIN_VALUE.
 * @param board - Current board
 */
export function isWon(board: Readonly<Board>): boolean {
  return board.some((value) => value === WIN_VALUE);
}

/**
 * Returns true when no empty cells remain and no adjacent equal pairs exist.
 * @param board - Current board
 */
export function isLost(board: Readonly<Board>): boolean {
  if (getEmptyCells(board).length > 0) {
    return false;
  }

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const index = row * BOARD_SIZE + col;
      const value = board[index];

      if (col + 1 < BOARD_SIZE) {
        const right = board[index + 1];
        if (value === right) {
          return false;
        }
      }

      if (row + 1 < BOARD_SIZE) {
        const below = board[index + BOARD_SIZE];
        if (value === below) {
          return false;
        }
      }
    }
  }

  return true;
}
