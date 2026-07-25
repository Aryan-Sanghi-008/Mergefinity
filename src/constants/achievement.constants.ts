/**
 * @file achievement.constants.ts
 * @layer constants
 * @description Achievement roster ids and unlock thresholds (P-12).
 */

import type { AchievementId, CellValue } from '@/types';

/** All achievement ids — used to seed locked progress. */
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

/** Milestone / strategy tile targets. */
export const ACHIEVEMENT_TILE_1024: CellValue = 1024;
export const ACHIEVEMENT_TILE_2048: CellValue = 2048;
export const ACHIEVEMENT_TILE_4096: CellValue = 4096;
export const ACHIEVEMENT_TILE_8192: CellValue = 8192;
export const ACHIEVEMENT_TILE_131072: CellValue = 131072;

/** Endless contribution to All-Rounder. */
export const ACHIEVEMENT_ENDLESS_WIN_TILE: CellValue = 4096;

/** Quick Victory: under 3 minutes. */
export const ACHIEVEMENT_QUICK_VICTORY_MS = 3 * 60 * 1000;

/** Blitz: moves in Time Attack. */
export const ACHIEVEMENT_BLITZ_MOVES = 100;

/** Speed Demon: Time Attack score. */
export const ACHIEVEMENT_SPEED_DEMON_SCORE = 20_000;

/** Efficient: max moves to reach 2048. */
export const ACHIEVEMENT_EFFICIENT_MAX_MOVES = 150;

/** Dedication thresholds. */
export const ACHIEVEMENT_CENTURY_GAMES = 100;
export const ACHIEVEMENT_VETERAN_GAMES = 500;
export const ACHIEVEMENT_COMMITTED_DAYS = 7;
export const ACHIEVEMENT_UNSTOPPABLE_STREAK = 10;

/** Comeback: losses before a win. */
export const ACHIEVEMENT_COMEBACK_LOSSES = 3;
