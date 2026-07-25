/**
 * @file achievement.constants.ts
 * @layer constants
 * @description Achievement id roster for store initialization (P-09 / P-12).
 */

import type { AchievementId } from '@/types';

/** All achievement ids — used to seed locked statuses. */
export const ACHIEVEMENT_IDS = [
  'first_win',
  'halfway_there',
  'double_down',
  'legendary',
  'the_summit',
  'quick_victory',
  'blitz',
  'speed_demon',
  'purist',
  'efficient',
  'corner_master',
  'century_club',
  'committed',
  'veteran',
  'unstoppable',
  'challenge_accepted',
  'against_the_clock',
  'all_rounder',
  'the_beginning',
  'comeback',
] as const satisfies readonly AchievementId[];

/** Max session history rows retained in statsStore. */
export const MAX_SESSION_HISTORY = 10;
