/**
 * @file animations.ts
 * @layer styles
 * @description Typed motion configs for Reanimated (P-04 / P-07).
 */

import {
  MERGE_DURATION_MS,
  MERGE_SCALE,
  OVERLAY_DURATION_MS,
  SCORE_DELTA_DURATION_MS,
  SCORE_DELTA_TRAVEL_DP,
  SLIDE_DURATION_MS,
  SPAWN_DELAY_MS,
  SPAWN_DURATION_MS,
  SPAWN_INITIAL_SCALE,
} from '@/constants';

/** Slide timing config (ease-out feel applied at call site). */
export const SLIDE_ANIMATION = {
  durationMs: SLIDE_DURATION_MS,
} as const;

/** Merge pop scale sequence config. */
export const MERGE_POP_ANIMATION = {
  peakScale: MERGE_SCALE,
  upDurationMs: 60,
  spring: {
    damping: 12,
    stiffness: 200,
  },
  budgetMs: MERGE_DURATION_MS,
} as const;

/** Spawn-in config. */
export const SPAWN_ANIMATION = {
  initialScale: SPAWN_INITIAL_SCALE,
  durationMs: SPAWN_DURATION_MS,
  delayMs: SPAWN_DELAY_MS,
  spring: {
    damping: 14,
    stiffness: 180,
  },
} as const;

/** Floating score delta. */
export const SCORE_DELTA_ANIMATION = {
  durationMs: SCORE_DELTA_DURATION_MS,
  travelDp: SCORE_DELTA_TRAVEL_DP,
} as const;

/** Win / game-over overlay. */
export const OVERLAY_ANIMATION = {
  durationMs: OVERLAY_DURATION_MS,
  translateFromDp: 20,
} as const;
