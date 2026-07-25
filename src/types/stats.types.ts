/**
 * @file stats.types.ts
 * @layer types
 * @description Statistics and session history shapes (P-11).
 */

import type { CellValue, GameMode } from './game.types';

/** Aggregate stats for a single game mode. */
export interface GameStats {
  /** Mode these stats belong to. */
  mode: GameMode;
  /** Games started in this mode. */
  gamesPlayed: number;
  /** Wins counted for this mode. */
  wins: number;
  /** Losses counted for this mode. */
  losses: number;
  /** Best score achieved. */
  bestScore: number;
  /** Highest tile value reached. */
  bestTile: CellValue;
  /** Total merge events. */
  totalMerges: number;
  /** Running sum of end scores (for average). */
  scoreSum: number;
}

/** Cross-mode lifetime aggregates. */
export interface LifetimeStats {
  /** Games across all modes. */
  totalGames: number;
  /** Total play time in minutes. */
  totalPlayMinutes: number;
  /** All-time best score. */
  allTimeBestScore: number;
  /** All-time best tile. */
  allTimeBestTile: CellValue;
  /** Current consecutive wins. */
  currentWinStreak: number;
  /** Longest consecutive wins. */
  longestWinStreak: number;
  /** Current consecutive play days. */
  currentPlayStreakDays: number;
  /** Longest consecutive play days. */
  longestPlayStreakDays: number;
  /**
   * Last calendar day a game was recorded (`YYYY-MM-DD` local), or `null`.
   */
  lastPlayDayKey: string | null;
  /** Consecutive losses (resets on win); used for Comeback. */
  consecutiveLosses: number;
  /** Modes that have met win criteria at least once. */
  modesWon: Record<GameMode, boolean>;
  /**
   * Merge histogram: how many times each tile value was created.
   * Keys are CellValue powers of two from 2 upward.
   */
  mergeHistogram: Partial<Record<CellValue, number>>;
}

/** One finished (or abandoned) session row. */
export interface SessionRecord {
  /** Mode played. */
  mode: GameMode;
  /** Final score. */
  score: number;
  /** Best tile that game. */
  bestTile: CellValue;
  /** Duration in seconds. */
  durationSeconds: number;
  /** Epoch ms end (or save) time. */
  endedAt: number;
}

/** Terminal outcome for a recorded session. */
export type GameEndOutcome = 'win' | 'loss';

/** Payload for recording a finished game into stats. */
export interface RecordGameEndPayload {
  /** Mode that was played. */
  mode: GameMode;
  /** Win or loss. */
  outcome: GameEndOutcome;
  /** Final score. */
  score: number;
  /** Highest tile on the board at end. */
  bestTile: CellValue;
  /** Elapsed session duration in seconds. */
  durationSeconds: number;
}
