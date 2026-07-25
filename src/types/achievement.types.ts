/**
 * @file achievement.types.ts
 * @layer types
 * @description Achievement domain types (P-12).
 */

import type { Board, CellValue, GameMode } from './game.types';

/** Stable achievement identifiers matching the P-12 roster. */
export type AchievementId =
  | 'first_win'
  | 'halfway_there'
  | 'double_down'
  | 'legendary'
  | 'the_summit'
  | 'quick_victory'
  | 'blitz'
  | 'speed_demon'
  | 'purist'
  | 'efficient'
  | 'corner_master'
  | 'century_club'
  | 'committed'
  | 'veteran'
  | 'unstoppable'
  | 'challenge_accepted'
  | 'against_the_clock'
  | 'all_rounder'
  | 'the_beginning'
  | 'comeback';

/** Achievement category for gallery grouping. */
export type AchievementCategory =
  | 'milestones'
  | 'speed'
  | 'strategy'
  | 'dedication'
  | 'exploration'
  | 'curiosity';

/** Unlock / progress state for one achievement. */
export type AchievementStatus = 'locked' | 'unlocked';

/** Static definition of one achievement (config layer). */
export interface Achievement {
  /** Stable id. */
  id: AchievementId;
  /** Display name (prefer STRINGS key at call sites). */
  name: string;
  /** Short description. */
  description: string;
  /** Gallery category. */
  category: AchievementCategory;
}

/** Snapshot used by pure achievement checks. */
export interface AchievementContext {
  /** Current board. */
  board: Board;
  /** Board axis length. */
  boardSize: number;
  /** Active mode. */
  mode: GameMode;
  /** Current score. */
  score: number;
  /** Moves this session. */
  moveCount: number;
  /** Session age in ms. */
  sessionDurationMs: number;
  /** Undos performed this session. */
  undosUsed: number;
  /** Highest tile on the board. */
  maxTile: CellValue;
  /** Whether Keep Going was chosen. */
  continuedAfterWin: boolean;
  /** Current game status. */
  status: 'idle' | 'playing' | 'won' | 'lost' | 'animating';
  /** Lifetime games played. */
  totalGames: number;
  /** Current win streak. */
  currentWinStreak: number;
  /** Longest win streak. */
  longestWinStreak: number;
  /** Current play-day streak. */
  currentPlayStreakDays: number;
  /** Longest play-day streak. */
  longestPlayStreakDays: number;
  /** Consecutive losses before the latest game-end (for Comeback). */
  consecutiveLossesBeforeWin: number;
  /** Modes that have met their win criteria at least once. */
  modesWon: Record<GameMode, boolean>;
  /** Lifetime best tile across modes (for endless milestone). */
  allTimeBestTile: CellValue;
  /** True when this evaluation follows a newly recorded win. */
  justWon: boolean;
  /** True when this evaluation follows a newly recorded loss. */
  justLost: boolean;
  /** True once any move has been committed this install (beginning). */
  hasPlayedMove: boolean;
}

/** Config entry with unlock + optional progress helpers. */
export interface AchievementDefinition {
  /** Stable id. */
  id: AchievementId;
  /** Display name. */
  name: string;
  /** Short description. */
  description: string;
  /** Gallery category. */
  category: AchievementCategory;
  /** Optional progress denominator. */
  progressTarget?: number;
  /** Whether the achievement is satisfied. */
  check: (ctx: AchievementContext) => boolean;
  /** Optional live progress numerator. */
  progress?: (ctx: AchievementContext) => number;
}

/** Runtime progress for one achievement. */
export interface AchievementProgress {
  /** Achievement id. */
  id: AchievementId;
  /** Locked or unlocked. */
  status: AchievementStatus;
  /** Optional numerator toward unlock (e.g. games played). */
  progressCurrent?: number;
  /** Optional denominator for progress. */
  progressTarget?: number;
  /** Epoch ms when unlocked. */
  unlockedAt?: number;
}
