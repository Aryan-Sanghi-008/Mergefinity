/**
 * @file boardUtils.test.ts
 * @layer engine
 * @description Unit tests for board utility pure functions.
 */

import type { Board, CellValue } from '@/types';

import {
  cloneBoard,
  createEmptyBoard,
  getEmptyCells,
  spawnTile,
} from './boardUtils';
import { shiftRowLeft } from './rowShifter';

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

describe('cloneBoard', () => {
  it('returns a deep copy with equal values', () => {
    const board = createEmptyBoard();
    board[0] = 2;
    const copy = cloneBoard(board);
    expect(copy).toEqual(board);
    expect(copy).not.toBe(board);
  });

  it('isolates mutations from the original', () => {
    const board = createEmptyBoard();
    board[0] = 2;
    const copy = cloneBoard(board);
    copy[0] = 4;
    expect(board[0]).toBe(2);
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

  it('clamps an out-of-range rng pick into a valid empty cell', () => {
    const board = createEmptyBoard();
    board[0] = 2;
    // first call returns 1 → floor(1 * 15) = 15 (last empty); second → 2
    const sequence = [1, 0.5];
    let i = 0;
    const next = spawnTile(board, () => sequence[i++] ?? 0);
    expect(getEmptyCells(next)).toHaveLength(14);
    expect(next.some((v, idx) => idx !== 0 && v === 2)).toBe(true);
  });

  it('uses Math.random by default without throwing on an empty board', () => {
    const next = spawnTile(createEmptyBoard());
    expect(getEmptyCells(next)).toHaveLength(15);
  });
});

describe('shiftRowLeft', () => {
  it('handles an empty row', () => {
    const { row, delta, moves } = shiftRowLeft([0, 0, 0, 0]);
    expect(row).toEqual([0, 0, 0, 0]);
    expect(delta).toBe(0);
    expect(moves).toEqual([]);
  });

  it('slides a single tile left', () => {
    const { row, delta, moves } = shiftRowLeft([0, 0, 2, 0]);
    expect(row).toEqual([2, 0, 0, 0]);
    expect(delta).toBe(0);
    expect(moves).toEqual([{ fromCol: 2, toCol: 0, value: 2, merged: false }]);
  });

  it('merges two equal adjacent tiles', () => {
    const { row, delta, moves } = shiftRowLeft([2, 2, 0, 0]);
    expect(row).toEqual([4, 0, 0, 0]);
    expect(delta).toBe(4);
    expect(moves).toHaveLength(2);
    expect(moves.every((m) => m.merged && m.toCol === 0 && m.value === 4)).toBe(true);
  });

  it('does not chain-merge in a single move', () => {
    const { row, delta } = shiftRowLeft([2, 2, 4, 0]);
    expect(row).toEqual([4, 4, 0, 0]);
    expect(delta).toBe(4);
  });

  it('merges pairs from the left when all same', () => {
    const { row, delta } = shiftRowLeft([2, 2, 2, 2]);
    expect(row).toEqual([4, 4, 0, 0]);
    expect(delta).toBe(8);
  });

  it('handles alternating values without merges', () => {
    const { row, delta } = shiftRowLeft([2, 4, 2, 4]);
    expect(row).toEqual([2, 4, 2, 4]);
    expect(delta).toBe(0);
  });

  it('handles triple same — only first pair merges', () => {
    const { row, delta } = shiftRowLeft([2, 2, 2, 0]);
    expect(row).toEqual([4, 2, 0, 0]);
    expect(delta).toBe(4);
  });

  it('blocks already-merged tiles from chaining', () => {
    const { row, delta } = shiftRowLeft([4, 2, 2, 0]);
    expect(row).toEqual([4, 4, 0, 0]);
    expect(delta).toBe(4);
  });

  it('slides with zeros interspersed', () => {
    const { row, delta } = shiftRowLeft([0, 2, 0, 4]);
    expect(row).toEqual([2, 4, 0, 0]);
    expect(delta).toBe(0);
  });

  it('leaves an already-left row unchanged', () => {
    const { row, delta, moves } = shiftRowLeft([2, 4, 8, 16]);
    expect(row).toEqual([2, 4, 8, 16]);
    expect(delta).toBe(0);
    expect(moves.every((m) => m.fromCol === m.toCol && !m.merged)).toBe(true);
  });

  it('merges after sliding across zeros', () => {
    const { row, delta } = shiftRowLeft([2, 0, 2, 0]);
    expect(row).toEqual([4, 0, 0, 0]);
    expect(delta).toBe(4);
  });

  it('returns a new row array reference', () => {
    const input: CellValue[] = [2, 0, 0, 0];
    const { row } = shiftRowLeft(input);
    expect(row).not.toBe(input);
  });
});
