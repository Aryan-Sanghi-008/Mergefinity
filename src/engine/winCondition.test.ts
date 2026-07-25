/**
 * @file winCondition.test.ts
 * @layer engine
 * @description Unit tests for win and loss detection.
 */

import type { Board, CellValue } from '@/types';

import { createEmptyBoard } from './boardUtils';
import { isLost, isWon } from './winCondition';

describe('isWon', () => {
  it('returns false when WIN_VALUE is absent', () => {
    const board = createEmptyBoard();
    board[0] = 1024;
    expect(isWon(board)).toBe(false);
  });

  it('returns true when a cell is 2048', () => {
    const board = createEmptyBoard();
    board[7] = 2048;
    expect(isWon(board)).toBe(true);
  });

  it('returns true when a cell exceeds WIN_VALUE', () => {
    const board = createEmptyBoard();
    board[0] = 4096;
    expect(isWon(board)).toBe(true);
  });
});

describe('isLost', () => {
  it('returns false when empty cells remain', () => {
    const board = createEmptyBoard();
    board[0] = 2;
    expect(isLost(board)).toBe(false);
  });

  it('returns false when a horizontal merge is possible', () => {
    const board = Array.from({ length: 16 }, (_, i) =>
      i % 2 === 0 ? (2 as CellValue) : (4 as CellValue),
    ) as Board;
    board[0] = 2;
    board[1] = 2;
    board[2] = 4;
    board[3] = 8;
    expect(isLost(board)).toBe(false);
  });

  it('returns false when a vertical merge is possible', () => {
    const board = [
      2, 4, 8, 16, 2, 8, 16, 32, 4, 16, 32, 64, 8, 32, 64, 128,
    ] as Board;
    expect(isLost(board)).toBe(false);
  });

  it('returns true when full with no merges', () => {
    const board = [
      2, 4, 8, 16, 4, 8, 16, 32, 8, 16, 32, 64, 16, 32, 64, 128,
    ] as Board;
    expect(isLost(board)).toBe(true);
  });
});
