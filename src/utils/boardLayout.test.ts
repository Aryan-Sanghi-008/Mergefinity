/**
 * @file boardLayout.test.ts
 * @layer utils
 * @description Unit tests for P-06 board layout math.
 */

import { getAllCellOffsets, getCellOffset, getTileSize } from './boardLayout';

describe('getTileSize', () => {
  it('fills the board with tiles and outer/inter gaps', () => {
    // 4 tiles + 5 gaps of 8 on a 340px board → (340 - 40) / 4 = 75
    expect(getTileSize(340, 4, 8)).toBe(75);
  });
});

describe('getCellOffset', () => {
  it('matches the plan gap-inset formula', () => {
    const tileSize = 75;
    const gap = 8;
    const cellCount = 4;

    expect(getCellOffset(0, cellCount, tileSize, gap)).toEqual({ left: 8, top: 8 });
    expect(getCellOffset(1, cellCount, tileSize, gap)).toEqual({ left: 91, top: 8 });
    expect(getCellOffset(4, cellCount, tileSize, gap)).toEqual({ left: 8, top: 91 });
    expect(getCellOffset(15, cellCount, tileSize, gap)).toEqual({ left: 257, top: 257 });
  });
});

describe('getAllCellOffsets', () => {
  it('returns one offset per cell', () => {
    const offsets = getAllCellOffsets(4, 75, 8);
    expect(offsets).toHaveLength(16);
    expect(offsets[0]).toEqual({ left: 8, top: 8 });
    expect(offsets[15]).toEqual({ left: 257, top: 257 });
  });

  it('keeps symmetric outer gap insets', () => {
    const boardSizePx = 340;
    const gap = 8;
    const cellCount = 4;
    const tileSize = getTileSize(boardSizePx, cellCount, gap);
    const first = getCellOffset(0, cellCount, tileSize, gap);
    const last = getCellOffset(15, cellCount, tileSize, gap);
    expect(first.left).toBe(gap);
    expect(first.top).toBe(gap);
    expect(last.left + tileSize).toBe(boardSizePx - gap);
    expect(last.top + tileSize).toBe(boardSizePx - gap);
  });
});
