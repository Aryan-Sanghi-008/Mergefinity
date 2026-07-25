/**
 * @file statsHelpers.test.ts
 * @layer utils
 * @description Unit tests for stats pure helpers.
 */

import type { Board, LifetimeStats } from '@/types';

import { createEmptyLifetimeStats } from './statsDefaults';
import {
  applyPlayDayStreak,
  averageScore,
  computeWinRate,
  formatPlayDayKey,
  maxBoardTile,
  mergeValuesFromMoves,
  previousPlayDayKey,
} from './statsHelpers';

describe('statsHelpers', () => {
  it('maxBoardTile returns the highest cell', () => {
    const board = [2, 0, 8, 4, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as Board;
    expect(maxBoardTile(board)).toBe(16);
  });

  it('computeWinRate rounds to nearest integer across 50 games', () => {
    expect(computeWinRate(0, 0)).toBe(0);
    expect(computeWinRate(21, 50)).toBe(42);
    expect(computeWinRate(22, 50)).toBe(44);
    expect(computeWinRate(1, 3)).toBe(33);
  });

  it('averageScore floors the mean', () => {
    expect(averageScore(0, 0)).toBe(0);
    expect(averageScore(100, 3)).toBe(33);
  });

  it('play day keys advance by one local calendar day', () => {
    expect(previousPlayDayKey('2026-07-25')).toBe('2026-07-24');
    expect(previousPlayDayKey('2026-03-01')).toBe('2026-02-28');
  });

  it('applyPlayDayStreak continues consecutive days', () => {
    const base: LifetimeStats = {
      ...createEmptyLifetimeStats(),
      currentPlayStreakDays: 2,
      longestPlayStreakDays: 5,
      lastPlayDayKey: '2026-07-24',
    };
    const next = applyPlayDayStreak(base, '2026-07-25');
    expect(next.currentPlayStreakDays).toBe(3);
    expect(next.longestPlayStreakDays).toBe(5);
    expect(next.lastPlayDayKey).toBe('2026-07-25');
  });

  it('applyPlayDayStreak resets after a gap', () => {
    const base: LifetimeStats = {
      ...createEmptyLifetimeStats(),
      currentPlayStreakDays: 4,
      longestPlayStreakDays: 4,
      lastPlayDayKey: '2026-07-20',
    };
    const next = applyPlayDayStreak(base, '2026-07-25');
    expect(next.currentPlayStreakDays).toBe(1);
    expect(next.longestPlayStreakDays).toBe(4);
  });

  it('formatPlayDayKey matches local date parts', () => {
    const date = new Date(2026, 6, 25);
    expect(formatPlayDayKey(date)).toBe('2026-07-25');
  });

  it('mergeValuesFromMoves dedupes by destination cell', () => {
    expect(
      mergeValuesFromMoves([
        { to: 0, value: 4, merged: true },
        { to: 0, value: 4, merged: true },
        { to: 1, value: 8, merged: true },
        { to: 2, value: 2, merged: false },
      ]),
    ).toEqual([4, 8]);
  });
});
