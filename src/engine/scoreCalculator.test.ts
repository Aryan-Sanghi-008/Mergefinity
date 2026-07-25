/**
 * @file scoreCalculator.test.ts
 * @layer engine
 * @description Unit tests for merge score helpers.
 */

import { calculateMergeBonuses, scoreFromMerge } from './scoreCalculator';

describe('calculateMergeBonuses', () => {
  it('sums merge values', () => {
    expect(calculateMergeBonuses([4, 8, 16])).toBe(28);
  });

  it('returns 0 for an empty list', () => {
    expect(calculateMergeBonuses([])).toBe(0);
  });
});

describe('scoreFromMerge', () => {
  it('returns the merged tile value', () => {
    expect(scoreFromMerge(4)).toBe(4);
    expect(scoreFromMerge(2048)).toBe(2048);
  });
});
