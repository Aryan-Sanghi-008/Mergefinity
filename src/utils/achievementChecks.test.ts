/**
 * @file achievementChecks.test.ts
 * @layer utils
 * @description Unit tests for pure achievement unlock rules.
 */

import { ACHIEVEMENT_VETERAN_GAMES } from '@/constants';
import type { AchievementContext, Board } from '@/types';

import {
  checkAndUnlock,
  createEmptyModesWon,
  hasTileInCorner,
} from './achievementChecks';

function baseCtx(overrides: Partial<AchievementContext> = {}): AchievementContext {
  const board = Array.from({ length: 16 }, () => 0) as Board;
  return {
    board,
    boardSize: 4,
    mode: 'classic',
    score: 0,
    moveCount: 0,
    sessionDurationMs: 60_000,
    undosUsed: 0,
    maxTile: 0,
    continuedAfterWin: false,
    status: 'playing',
    totalGames: 0,
    currentWinStreak: 0,
    longestWinStreak: 0,
    currentPlayStreakDays: 0,
    longestPlayStreakDays: 0,
    consecutiveLossesBeforeWin: 0,
    modesWon: createEmptyModesWon(),
    allTimeBestTile: 0,
    justWon: false,
    justLost: false,
    hasPlayedMove: false,
    ...overrides,
  };
}

describe('achievementChecks', () => {
  it('detects a 2048 tile in a corner', () => {
    const board = Array.from({ length: 16 }, () => 0) as Board;
    board[0] = 2048;
    expect(hasTileInCorner(board, 4, 2048)).toBe(true);
    board[0] = 0;
    board[5] = 2048;
    expect(hasTileInCorner(board, 4, 2048)).toBe(false);
  });

  it('unlocks milestones by max tile', () => {
    const ids = checkAndUnlock(baseCtx({ maxTile: 2048 }), []);
    expect(ids).toEqual(
      expect.arrayContaining(['halfway_there', 'first_win']),
    );
    expect(ids).not.toContain('double_down');
  });

  it('unlocks purist only with zero undos', () => {
    expect(
      checkAndUnlock(baseCtx({ maxTile: 2048, undosUsed: 0 }), []),
    ).toContain('purist');
    expect(
      checkAndUnlock(baseCtx({ maxTile: 2048, undosUsed: 1 }), []),
    ).not.toContain('purist');
  });

  it('unlocks veteran at threshold and does not double-count when already unlocked', () => {
    const ctx = baseCtx({ totalGames: ACHIEVEMENT_VETERAN_GAMES });
    expect(checkAndUnlock(ctx, [])).toContain('veteran');
    expect(checkAndUnlock(ctx, ['veteran'])).not.toContain('veteran');
  });

  it('is idempotent when already unlocked', () => {
    const ctx = baseCtx({ maxTile: 2048 });
    const first = checkAndUnlock(ctx, []);
    expect(first.length).toBeGreaterThan(0);
    expect(checkAndUnlock(ctx, first)).toEqual([]);
  });

  it('unlocks efficient under 150 moves', () => {
    expect(
      checkAndUnlock(baseCtx({ maxTile: 2048, moveCount: 149 }), []),
    ).toContain('efficient');
    expect(
      checkAndUnlock(baseCtx({ maxTile: 2048, moveCount: 150 }), []),
    ).not.toContain('efficient');
  });

  it('unlocks blitz and speed demon in time attack', () => {
    expect(
      checkAndUnlock(
        baseCtx({ mode: 'time-attack', moveCount: 100 }),
        [],
      ),
    ).toContain('blitz');
    expect(
      checkAndUnlock(
        baseCtx({ mode: 'time-attack', score: 20_001 }),
        [],
      ),
    ).toContain('speed_demon');
  });

  it('unlocks comeback after three losses then a win', () => {
    expect(
      checkAndUnlock(
        baseCtx({ justWon: true, consecutiveLossesBeforeWin: 3 }),
        [],
      ),
    ).toContain('comeback');
    expect(
      checkAndUnlock(
        baseCtx({ justWon: true, consecutiveLossesBeforeWin: 2 }),
        [],
      ),
    ).not.toContain('comeback');
  });

  it('unlocks all_rounder when all modesWon are true', () => {
    expect(
      checkAndUnlock(
        baseCtx({
          modesWon: {
            classic: true,
            endless: true,
            challenge: true,
            'time-attack': true,
          },
        }),
        [],
      ),
    ).toContain('all_rounder');
  });

  it('unlocks the_beginning on first move', () => {
    expect(checkAndUnlock(baseCtx({ hasPlayedMove: true }), [])).toContain(
      'the_beginning',
    );
  });

  it('unlocks corner_master when 2048 sits in a corner', () => {
    const board = Array.from({ length: 16 }, () => 0) as Board;
    board[15] = 2048;
    expect(
      checkAndUnlock(baseCtx({ board, maxTile: 2048 }), []),
    ).toContain('corner_master');
  });
});
