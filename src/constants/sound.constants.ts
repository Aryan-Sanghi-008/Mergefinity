/**
 * @file sound.constants.ts
 * @layer constants
 * @description Audio asset keys and playback tuning (P-15).
 */

import type { Direction } from '@/types';

/** Merge SFX switches to high variant at this tile value. */
export const MERGE_SFX_HIGH_THRESHOLD = 128 as const;

/** Sound effect identifiers. */
export type SoundId =
  | 'tile_slide'
  | 'tile_merge_low'
  | 'tile_merge_high'
  | 'win_chime'
  | 'game_over'
  | 'achievement_unlock';

/** Playback rate per swipe direction (distinct pitch for slide). */
export const SLIDE_PITCH_BY_DIRECTION: Record<Direction, number> = {
  UP: 1.08,
  RIGHT: 1.04,
  DOWN: 0.96,
  LEFT: 0.92,
};
