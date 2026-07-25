/**
 * @file boardUtils.test.ts
 * @layer engine
 * @description Unit tests for board utility pure functions.
 */

import type { Board, CellValue } from '@/types';

import {
  createEmptyBoard,
  getEmptyCells,
  shiftRowLeft,
  spawnTile,
} from './boardUtils';


describe('createEmptyBoard', () => {
  it('returns 16 zeros', () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(16);
    expect(board.every((v) => v === 0)).toBe(true);
  });

  it('returns a new array each call', () => {
    expect(createEmptyBoard()).not.toBe(createEmptyBoard());
  });
});

describe('getEmptyCells', () => {
  it('returns all indices for an empty board', () => {
    expect(getEmptyCells(createEmptyBoard())).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    ]);
  });

  it('omits occupied cells', () => {
    const board = createEmptyBoard();
    board[0] = 2;
    board[5] = 4;
    expect(getEmptyCells(board)).not.toContain(0);
    expect(getEmptyCells(board)).not.toContain(5);
    expect(getEmptyCells(board)).toHaveLength(14);
  });
});

describe('spawnTile', () => {
  it('places a 2 when rng is below spawn weight', () => {
    const board = createEmptyBoard();
    // first rng: pick index 0 of empty; second rng: value < 0.9 → 2
    const sequence = [0, 0.5];
    let i = 0;
    const rng = () => sequence[i++] ?? 0;
    const next = spawnTile(board, rng);
    expect(next[0]).toBe(2);
    expect(board[0]).toBe(0);
  });

  it('places a 4 when rng is at or above spawn weight', () => {
    const board = createEmptyBoard();
    const sequence = [0, 0.95];
    let i = 0;
    const rng = () => sequence[i++] ?? 0;
    const next = spawnTile(board, rng);
    expect(next[0]).toBe(4);
  });

  it('returns a copy unchanged when board is full', () => {
    const board = Array.from({ length: 16 }, () => 2 as CellValue) as Board;
    const next = spawnTile(board, () => 0);
    expect(next).toEqual(board);
    expect(next).not.toBe(board);
  });

  it('never mutates the input board', () => {
    const board = Object.freeze([...createEmptyBoard()]) as Board;
    expect(() => spawnTile(board, () => 0)).not.toThrow();
  });
});

describe('shiftRowLeft', () => {
  describe('when tiles can merge', () => {
    it('merges two equal adjacent tiles', () => {
      const { row, delta } = shiftRowLeft([2, 2, 0, 0]);
      expect(row).toEqual([4, 0, 0, 0]);
      expect(delta).toBe(4);
    });

    it('does not chain-merge in a single move', () => {
      const { row, delta } = shiftRowLeft([2, 2, 4, 0]);
      expect(row).toEqual([4, 4, 0, 0]);
      expect(delta).toBe(4);
    });

    it('merges pairs from the left', () => {
      const { row, delta } = shiftRowLeft([2, 2, 2, 2]);
      expect(row).toEqual([4, 4, 0, 0]);
      expect(delta).toBe(8);
    });
  });

  describe('when no merges occur', () => {
    it('slides tiles left and pads zeros', () => {
      const { row, delta } = shiftRowLeft([0, 2, 0, 4]);
      expect(row).toEqual([2, 4, 0, 0]);
      expect(delta).toBe(0);
    });

    it('leaves an already-left row unchanged', () => {
      const { row, delta } = shiftRowLeft([2, 4, 8, 16]);
      expect(row).toEqual([2, 4, 8, 16]);
      expect(delta).toBe(0);
    });
  });
});
