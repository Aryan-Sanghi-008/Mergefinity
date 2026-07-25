/**
 * @file achievement.types.ts
 * @layer types
 * @description Achievement domain types (roster unlocked in P-12).
 */

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
