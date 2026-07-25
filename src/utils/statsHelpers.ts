/**
 * @file statsHelpers.ts
 * @layer utils
 * @description Pure helpers for statistics aggregates (P-11).
 */

import { SECONDS_PER_MINUTE } from '@/constants';
import type {
  Board,
  CellValue,
  GameMode,
  GameStats,
  LifetimeStats,
} from '@/types';

import {
  createEmptyGameStats,
  createEmptyLifetimeStats,
} from './statsDefaults';

const PERCENT_SCALE = 100;
const PAD_TWO = 2;

/**
 * Highest non-empty tile on a board.
 */
export function maxBoardTile(board: Board): CellValue {
  let max: CellValue = 0;
  for (const cell of board) {
    if (cell > max) {
      max = cell;
    }
  }
  return max;
}

/**
 * Local calendar day key `YYYY-MM-DD`.
 */
export function formatPlayDayKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(PAD_TWO, '0');
  const day = String(date.getDate()).padStart(PAD_TWO, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Previous local calendar day key relative to `dayKey`.
 */
export function previousPlayDayKey(dayKey: string): string {
  const [yearRaw, monthRaw, dayRaw] = dayKey.split('-');
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() - 1);
  return formatPlayDayKey(date);
}

/**
 * Updates play-day streak fields for a newly recorded game day.
 */
export function applyPlayDayStreak(
  lifetime: LifetimeStats,
  dayKey: string,
): Pick<
  LifetimeStats,
  'currentPlayStreakDays' | 'longestPlayStreakDays' | 'lastPlayDayKey'
> {
  if (lifetime.lastPlayDayKey === dayKey) {
    return {
      currentPlayStreakDays: lifetime.currentPlayStreakDays,
      longestPlayStreakDays: lifetime.longestPlayStreakDays,
      lastPlayDayKey: dayKey,
    };
  }

  const continued =
    lifetime.lastPlayDayKey !== null &&
    previousPlayDayKey(dayKey) === lifetime.lastPlayDayKey;
  const currentPlayStreakDays = continued
    ? lifetime.currentPlayStreakDays + 1
    : 1;
  const longestPlayStreakDays = Math.max(
    lifetime.longestPlayStreakDays,
    currentPlayStreakDays,
  );

  return {
    currentPlayStreakDays,
    longestPlayStreakDays,
    lastPlayDayKey: dayKey,
  };
}

/**
 * Win rate as nearest integer percent (0 when no games).
 */
export function computeWinRate(wins: number, gamesPlayed: number): number {
  if (gamesPlayed <= 0) {
    return 0;
  }
  return Math.round((wins / gamesPlayed) * PERCENT_SCALE);
}

/**
 * Average end score (0 when no games), floored to an integer.
 */
export function averageScore(scoreSum: number, gamesPlayed: number): number {
  if (gamesPlayed <= 0) {
    return 0;
  }
  return Math.floor(scoreSum / gamesPlayed);
}

/**
 * Converts duration seconds to whole minutes (ceil, min 0).
 */
export function durationSecondsToPlayMinutes(durationSeconds: number): number {
  if (durationSeconds <= 0) {
    return 0;
  }
  return Math.ceil(durationSeconds / SECONDS_PER_MINUTE);
}

/**
 * Unique post-merge tile values from tile moves (one entry per merge).
 */
export function mergeValuesFromMoves(
  tileMoves: readonly { to: number; value: CellValue; merged: boolean }[],
): CellValue[] {
  const byTo = new Map<number, CellValue>();
  for (const move of tileMoves) {
    if (move.merged) {
      byTo.set(move.to, move.value);
    }
  }
  return [...byTo.values()];
}

/**
 * Empty per-mode map that preserves existing best scores and best tiles.
 */
export function resetByModePreservingBests(
  byMode: Record<GameMode, GameStats>,
): Record<GameMode, GameStats> {
  const modes = Object.keys(byMode) as GameMode[];
  const next = {} as Record<GameMode, GameStats>;
  for (const mode of modes) {
    const previous = byMode[mode];
    const empty = createEmptyGameStats(mode);
    next[mode] = {
      ...empty,
      bestScore: previous?.bestScore ?? 0,
      bestTile: previous?.bestTile ?? 0,
    };
  }
  return next;
}

/**
 * Empty lifetime stats that preserve all-time best score and tile.
 */
export function resetLifetimePreservingBests(
  lifetime: LifetimeStats,
): LifetimeStats {
  return {
    ...createEmptyLifetimeStats(),
    allTimeBestScore: lifetime.allTimeBestScore,
    allTimeBestTile: lifetime.allTimeBestTile,
  };
}
