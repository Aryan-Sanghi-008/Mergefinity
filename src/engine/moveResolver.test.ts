/**
 * @file moveResolver.test.ts
 * @layer engine
 * @description Unit tests for directional move resolution and rotation.
 */

import type { Board } from '@/types';

import { normalizeRotations, rotateBoard, rotateIndex } from './boardRotator';
import { resolveMove } from './moveResolver';

const make = (vals: number[]): Board => vals as Board;

describe('normalizeRotations', () => {
  it('wraps negative counts into [0, 4)', () => {
    expect(normalizeRotations(-1)).toBe(3);
    expect(normalizeRotations(5)).toBe(1);
    expect(normalizeRotations(0)).toBe(0);
  });
});

describe('rotateIndex', () => {
  it('maps corner 0 → 3 after one clockwise turn', () => {
    expect(rotateIndex(0, 1)).toBe(3);
  });

  it('returns the same index after four turns', () => {
    expect(rotateIndex(5, 4)).toBe(5);
  });
});

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

  it('returns a new array reference for zero rotations', () => {
    const board = make([2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const next = rotateBoard(board, 0);
    expect(next).toEqual(board);
    expect(next).not.toBe(board);
  });
});

describe('resolveMove', () => {
  describe('when tiles can merge', () => {
    it('merges two equal tiles when swiping LEFT', () => {
      const board = make([0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const { board: next, scoreDelta, boardChanged, tileMoves } = resolveMove(
        board,
        'LEFT',
      );
      expect(next[0]).toBe(4);
      expect(next[1]).toBe(0);
      expect(scoreDelta).toBe(4);
      expect(boardChanged).toBe(true);
      expect(tileMoves.some((m) => m.to === 0 && m.merged && m.value === 4)).toBe(
        true,
      );
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

    it('merges a corner pair on LEFT', () => {
      const board = make([2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const { board: next } = resolveMove(board, 'LEFT');
      expect(next[0]).toBe(4);
    });

    it('performs multi-merge in one swipe', () => {
      const board = make([2, 2, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const { board: next, scoreDelta } = resolveMove(board, 'LEFT');
      expect(next.slice(0, 4)).toEqual([4, 8, 0, 0]);
      expect(scoreDelta).toBe(12);
    });
  });

  describe('when no moves are possible', () => {
    it('returns boardChanged: false and empty tileMoves', () => {
      const board = make([2, 4, 8, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const { boardChanged, tileMoves, scoreDelta } = resolveMove(board, 'LEFT');
      expect(boardChanged).toBe(false);
      expect(tileMoves).toEqual([]);
      expect(scoreDelta).toBe(0);
    });
  });

  describe('direction symmetry', () => {
    it('LEFT on board equals RIGHT on a 180°-rotated board', () => {
      const board = make([0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      const left = resolveMove(board, 'LEFT').board;
      const rotated = rotateBoard(board, 2);
      const rightOnRotated = resolveMove(rotated, 'RIGHT').board;
      expect(rotateBoard(rightOnRotated, 2)).toEqual(left);
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
