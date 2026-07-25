/**
 * @file moveResolver.test.ts
 * @layer engine
 * @description Unit tests for directional move resolution.
 */

import type { Board } from '@/types';

import { resolveMove, rotateBoard } from './moveResolver';


const make = (vals: number[]): Board => vals as Board;

describe('rotateBoard', () => {
  it('rotates 90° clockwise once', () => {
    const board = make([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const rotated = rotateBoard(board, 1);
    expect(rotated).toEqual(
      make([13, 9, 5, 1, 14, 10, 6, 2, 15, 11, 7, 3, 16, 12, 8, 4]),
    );
  });

  it('returns the same layout after four rotations', () => {
    const board = make([2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4]);
    expect(rotateBoard(board, 4)).toEqual(board);
  });
});

describe('resolveMove', () => {
  describe('when tiles can merge', () => {
    it('merges two equal tiles when swiping LEFT', () => {
      const board = make([0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const { board: next, scoreDelta, boardChanged } = resolveMove(board, 'LEFT');
      expect(next[0]).toBe(4);
      expect(next[1]).toBe(0);
      expect(scoreDelta).toBe(4);
      expect(boardChanged).toBe(true);
    });

    it('merges when swiping RIGHT', () => {
      const board = make([2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const { board: next, scoreDelta } = resolveMove(board, 'RIGHT');
      expect(next[3]).toBe(4);
      expect(scoreDelta).toBe(4);
    });

    it('merges when swiping UP', () => {
      const board = make([2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const { board: next, scoreDelta } = resolveMove(board, 'UP');
      expect(next[0]).toBe(4);
      expect(next[4]).toBe(0);
      expect(scoreDelta).toBe(4);
    });

    it('merges when swiping DOWN', () => {
      const board = make([2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const { board: next, scoreDelta } = resolveMove(board, 'DOWN');
      expect(next[12]).toBe(4);
      expect(scoreDelta).toBe(4);
    });

    it('does not chain-merge in a single move', () => {
      const board = make([2, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const { board: next, scoreDelta } = resolveMove(board, 'LEFT');
      expect(next.slice(0, 4)).toEqual([4, 4, 0, 0]);
      expect(scoreDelta).toBe(4);
    });
  });

  describe('when no moves are possible', () => {
    it('returns boardChanged: false', () => {
      const board = make([2, 4, 8, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const { boardChanged } = resolveMove(board, 'LEFT');
      expect(boardChanged).toBe(false);
    });

    it('returns scoreDelta 0', () => {
      const board = make([2, 4, 8, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const { scoreDelta } = resolveMove(board, 'LEFT');
      expect(scoreDelta).toBe(0);
    });
  });

  describe('immutability', () => {
    it('never mutates the input board', () => {
      const board = Object.freeze(
        make([2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      ) as Board;
      expect(() => resolveMove(board, 'LEFT')).not.toThrow();
    });

    it('returns a new array reference', () => {
      const board = make([2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const { board: next } = resolveMove(board, 'LEFT');
      expect(next).not.toBe(board);
    });
  });
});
