/**
 * @file statsDefaults.ts
 * @layer utils
 * @description Default stats / lifetime shapes for statsStore.
 */

import type { GameMode, GameStats, LifetimeStats } from '@/types';

const MODES: GameMode[] = ['classic', 'endless', 'challenge', 'time-attack'];

/**
 * Empty per-mode stats row.
 */
export function createEmptyGameStats(mode: GameMode): GameStats {
  return {
    mode,
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    bestScore: 0,
    bestTile: 0,
    totalMerges: 0,
    scoreSum: 0,
  };
}

/**
 * Empty lifetime aggregates.
 */
export function createEmptyLifetimeStats(): LifetimeStats {
  return {
    totalGames: 0,
    totalPlayMinutes: 0,
    allTimeBestScore: 0,
    allTimeBestTile: 0,
    currentWinStreak: 0,
    longestWinStreak: 0,
    currentPlayStreakDays: 0,
    longestPlayStreakDays: 0,
    mergeHistogram: {},
  };
}

/**
 * Seed byMode map for all modes.
 */
export function createEmptyStatsByMode(): Record<GameMode, GameStats> {
  return {
    classic: createEmptyGameStats('classic'),
    endless: createEmptyGameStats('endless'),
    challenge: createEmptyGameStats('challenge'),
    'time-attack': createEmptyGameStats('time-attack'),
  };
}

export { MODES as GAME_MODES };
