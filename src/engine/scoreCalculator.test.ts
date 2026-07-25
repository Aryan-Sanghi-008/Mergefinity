/**
 * @file scoreCalculator.test.ts
 * @layer engine
 * @description Unit tests for merge score helpers.
 */

import { calculateMergeScore, scoreFromMerge } from './scoreCalculator';

describe('calculateMergeScore', () => {
  it('sums merge values', () => {
    expect(calculateMergeScore([4, 8, 16])).toBe(28);
  });

  it('returns 0 for an empty list', () => {
    expect(calculateMergeScore([])).toBe(0);
  });
});

describe('scoreFromMerge', () => {
  it('returns the merged tile value', () => {
    expect(scoreFromMerge(4)).toBe(4);
    expect(scoreFromMerge(2048)).toBe(2048);
  });
});
