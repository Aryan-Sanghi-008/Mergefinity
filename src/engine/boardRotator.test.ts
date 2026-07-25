/**
 * @file boardRotator.test.ts
 * @layer engine
 * @description Coverage for boardRotator edge paths.
 */

import type { Board } from '@/types';

import { normalizeRotations, rotateBoard, rotateIndex } from './boardRotator';

describe('boardRotator coverage', () => {
  it('handles negative normalize input beyond one wrap', () => {
    expect(normalizeRotations(-5)).toBe(3);
  });

  it('rotateIndex with zero times is identity', () => {
    expect(rotateIndex(7, 0)).toBe(7);
  });

  it('rotateBoard twice matches two single steps', () => {
    const board = [2, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8] as Board;
    const once = rotateBoard(board, 1);
    const twice = rotateBoard(once, 1);
    expect(rotateBoard(board, 2)).toEqual(twice);
  });
});
