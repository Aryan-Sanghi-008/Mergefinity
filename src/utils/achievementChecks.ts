/**
 * @file achievementChecks.ts
 * @layer utils
 * @description Pure achievement definitions and checkAndUnlock (P-12).
 */

import {
  ACHIEVEMENT_BLITZ_MOVES,
  ACHIEVEMENT_CENTURY_GAMES,
  ACHIEVEMENT_COMEBACK_LOSSES,
  ACHIEVEMENT_COMMITTED_DAYS,
  ACHIEVEMENT_EFFICIENT_MAX_MOVES,
  ACHIEVEMENT_ENDLESS_WIN_TILE,
  ACHIEVEMENT_IDS,
  ACHIEVEMENT_QUICK_VICTORY_MS,
  ACHIEVEMENT_SPEED_DEMON_SCORE,
  ACHIEVEMENT_TILE_1024,
  ACHIEVEMENT_TILE_131072,
  ACHIEVEMENT_TILE_2048,
  ACHIEVEMENT_TILE_4096,
  ACHIEVEMENT_TILE_8192,
  ACHIEVEMENT_UNSTOPPABLE_STREAK,
  ACHIEVEMENT_VETERAN_GAMES,
  STRINGS,
} from '@/constants';
import type {
  AchievementContext,
  AchievementDefinition,
  AchievementId,
  Board,
  CellValue,
  GameMode,
} from '@/types';

import { createEmptyModesWon } from './statsDefaults';

export { createEmptyModesWon };
export function hasTileInCorner(
  board: Board,
  boardSize: number,
  value: CellValue,
): boolean {
  const last = boardSize - 1;
  const corners = [
    0,
    last,
    boardSize * last,
    boardSize * boardSize - 1,
  ];
  return corners.some((index) => board[index] === value);
}

function reachedTile(ctx: AchievementContext, tile: CellValue): boolean {
  return ctx.maxTile >= tile;
}

/**
 * Full achievement config with check / progress helpers.
 */
export const ACHIEVEMENTS_CONFIG: Record<AchievementId, AchievementDefinition> = {
  first_win: {
    id: 'first_win',
    name: STRINGS.ACH_FIRST_WIN_NAME,
    description: STRINGS.ACH_FIRST_WIN_DESC,
    category: 'milestones',
    check: (ctx) => reachedTile(ctx, ACHIEVEMENT_TILE_2048),
  },
  halfway_there: {
    id: 'halfway_there',
    name: STRINGS.ACH_HALFWAY_THERE_NAME,
    description: STRINGS.ACH_HALFWAY_THERE_DESC,
    category: 'milestones',
    check: (ctx) => reachedTile(ctx, ACHIEVEMENT_TILE_1024),
  },
  double_down: {
    id: 'double_down',
    name: STRINGS.ACH_DOUBLE_DOWN_NAME,
    description: STRINGS.ACH_DOUBLE_DOWN_DESC,
    category: 'milestones',
    check: (ctx) => reachedTile(ctx, ACHIEVEMENT_TILE_4096),
  },
  legendary: {
    id: 'legendary',
    name: STRINGS.ACH_LEGENDARY_NAME,
    description: STRINGS.ACH_LEGENDARY_DESC,
    category: 'milestones',
    check: (ctx) => reachedTile(ctx, ACHIEVEMENT_TILE_8192),
  },
  the_summit: {
    id: 'the_summit',
    name: STRINGS.ACH_THE_SUMMIT_NAME,
    description: STRINGS.ACH_THE_SUMMIT_DESC,
    category: 'milestones',
    check: (ctx) => reachedTile(ctx, ACHIEVEMENT_TILE_131072),
  },
  quick_victory: {
    id: 'quick_victory',
    name: STRINGS.ACH_QUICK_VICTORY_NAME,
    description: STRINGS.ACH_QUICK_VICTORY_DESC,
    category: 'speed',
    check: (ctx) =>
      reachedTile(ctx, ACHIEVEMENT_TILE_2048) &&
      ctx.sessionDurationMs < ACHIEVEMENT_QUICK_VICTORY_MS,
  },
  blitz: {
    id: 'blitz',
    name: STRINGS.ACH_BLITZ_NAME,
    description: STRINGS.ACH_BLITZ_DESC,
    category: 'speed',
    progressTarget: ACHIEVEMENT_BLITZ_MOVES,
    check: (ctx) =>
      ctx.mode === 'time-attack' && ctx.moveCount >= ACHIEVEMENT_BLITZ_MOVES,
    progress: (ctx) =>
      ctx.mode === 'time-attack' ? Math.min(ctx.moveCount, ACHIEVEMENT_BLITZ_MOVES) : 0,
  },
  speed_demon: {
    id: 'speed_demon',
    name: STRINGS.ACH_SPEED_DEMON_NAME,
    description: STRINGS.ACH_SPEED_DEMON_DESC,
    category: 'speed',
    progressTarget: ACHIEVEMENT_SPEED_DEMON_SCORE,
    check: (ctx) =>
      ctx.mode === 'time-attack' && ctx.score > ACHIEVEMENT_SPEED_DEMON_SCORE,
    progress: (ctx) =>
      ctx.mode === 'time-attack'
        ? Math.min(ctx.score, ACHIEVEMENT_SPEED_DEMON_SCORE)
        : 0,
  },
  purist: {
    id: 'purist',
    name: STRINGS.ACH_PURIST_NAME,
    description: STRINGS.ACH_PURIST_DESC,
    category: 'strategy',
    check: (ctx) =>
      reachedTile(ctx, ACHIEVEMENT_TILE_2048) && ctx.undosUsed === 0,
  },
  efficient: {
    id: 'efficient',
    name: STRINGS.ACH_EFFICIENT_NAME,
    description: STRINGS.ACH_EFFICIENT_DESC,
    category: 'strategy',
    progressTarget: ACHIEVEMENT_EFFICIENT_MAX_MOVES,
    check: (ctx) =>
      reachedTile(ctx, ACHIEVEMENT_TILE_2048) &&
      ctx.moveCount < ACHIEVEMENT_EFFICIENT_MAX_MOVES,
    progress: (ctx) => Math.min(ctx.moveCount, ACHIEVEMENT_EFFICIENT_MAX_MOVES),
  },
  corner_master: {
    id: 'corner_master',
    name: STRINGS.ACH_CORNER_MASTER_NAME,
    description: STRINGS.ACH_CORNER_MASTER_DESC,
    category: 'strategy',
    check: (ctx) =>
      reachedTile(ctx, ACHIEVEMENT_TILE_2048) &&
      hasTileInCorner(ctx.board, ctx.boardSize, ACHIEVEMENT_TILE_2048),
  },
  century_club: {
    id: 'century_club',
    name: STRINGS.ACH_CENTURY_CLUB_NAME,
    description: STRINGS.ACH_CENTURY_CLUB_DESC,
    category: 'dedication',
    progressTarget: ACHIEVEMENT_CENTURY_GAMES,
    check: (ctx) => ctx.totalGames >= ACHIEVEMENT_CENTURY_GAMES,
    progress: (ctx) => Math.min(ctx.totalGames, ACHIEVEMENT_CENTURY_GAMES),
  },
  committed: {
    id: 'committed',
    name: STRINGS.ACH_COMMITTED_NAME,
    description: STRINGS.ACH_COMMITTED_DESC,
    category: 'dedication',
    progressTarget: ACHIEVEMENT_COMMITTED_DAYS,
    check: (ctx) =>
      ctx.currentPlayStreakDays >= ACHIEVEMENT_COMMITTED_DAYS ||
      ctx.longestPlayStreakDays >= ACHIEVEMENT_COMMITTED_DAYS,
    progress: (ctx) =>
      Math.min(
        Math.max(ctx.currentPlayStreakDays, ctx.longestPlayStreakDays),
        ACHIEVEMENT_COMMITTED_DAYS,
      ),
  },
  veteran: {
    id: 'veteran',
    name: STRINGS.ACH_VETERAN_NAME,
    description: STRINGS.ACH_VETERAN_DESC,
    category: 'dedication',
    progressTarget: ACHIEVEMENT_VETERAN_GAMES,
    check: (ctx) => ctx.totalGames >= ACHIEVEMENT_VETERAN_GAMES,
    progress: (ctx) => Math.min(ctx.totalGames, ACHIEVEMENT_VETERAN_GAMES),
  },
  unstoppable: {
    id: 'unstoppable',
    name: STRINGS.ACH_UNSTOPPABLE_NAME,
    description: STRINGS.ACH_UNSTOPPABLE_DESC,
    category: 'dedication',
    progressTarget: ACHIEVEMENT_UNSTOPPABLE_STREAK,
    check: (ctx) =>
      ctx.currentWinStreak >= ACHIEVEMENT_UNSTOPPABLE_STREAK ||
      ctx.longestWinStreak >= ACHIEVEMENT_UNSTOPPABLE_STREAK,
    progress: (ctx) =>
      Math.min(
        Math.max(ctx.currentWinStreak, ctx.longestWinStreak),
        ACHIEVEMENT_UNSTOPPABLE_STREAK,
      ),
  },
  challenge_accepted: {
    id: 'challenge_accepted',
    name: STRINGS.ACH_CHALLENGE_ACCEPTED_NAME,
    description: STRINGS.ACH_CHALLENGE_ACCEPTED_DESC,
    category: 'exploration',
    check: (ctx) => ctx.modesWon.challenge,
  },
  against_the_clock: {
    id: 'against_the_clock',
    name: STRINGS.ACH_AGAINST_THE_CLOCK_NAME,
    description: STRINGS.ACH_AGAINST_THE_CLOCK_DESC,
    category: 'exploration',
    check: (ctx) => ctx.modesWon['time-attack'],
  },
  all_rounder: {
    id: 'all_rounder',
    name: STRINGS.ACH_ALL_ROUNDER_NAME,
    description: STRINGS.ACH_ALL_ROUNDER_DESC,
    category: 'exploration',
    progressTarget: 4,
    check: (ctx) =>
      ctx.modesWon.classic &&
      ctx.modesWon.challenge &&
      ctx.modesWon['time-attack'] &&
      ctx.modesWon.endless,
    progress: (ctx) =>
      (ctx.modesWon.classic ? 1 : 0) +
      (ctx.modesWon.challenge ? 1 : 0) +
      (ctx.modesWon['time-attack'] ? 1 : 0) +
      (ctx.modesWon.endless ? 1 : 0),
  },
  the_beginning: {
    id: 'the_beginning',
    name: STRINGS.ACH_THE_BEGINNING_NAME,
    description: STRINGS.ACH_THE_BEGINNING_DESC,
    category: 'curiosity',
    check: (ctx) => ctx.totalGames >= 1 || ctx.hasPlayedMove,
  },
  comeback: {
    id: 'comeback',
    name: STRINGS.ACH_COMEBACK_NAME,
    description: STRINGS.ACH_COMEBACK_DESC,
    category: 'curiosity',
    progressTarget: ACHIEVEMENT_COMEBACK_LOSSES,
    check: (ctx) =>
      ctx.justWon &&
      ctx.consecutiveLossesBeforeWin >= ACHIEVEMENT_COMEBACK_LOSSES,
    progress: (ctx) =>
      Math.min(ctx.consecutiveLossesBeforeWin, ACHIEVEMENT_COMEBACK_LOSSES),
  },
};

/**
 * Evaluates locked achievements; returns newly unlocked ids only.
 */
export function checkAndUnlock(
  ctx: AchievementContext,
  alreadyUnlocked: ReadonlySet<AchievementId> | readonly AchievementId[],
): AchievementId[] {
  const unlocked =
    alreadyUnlocked instanceof Set
      ? alreadyUnlocked
      : new Set(alreadyUnlocked);
  const newlyUnlocked: AchievementId[] = [];
  for (const id of ACHIEVEMENT_IDS) {
    if (unlocked.has(id)) {
      continue;
    }
    const definition = ACHIEVEMENTS_CONFIG[id];
    if (definition.check(ctx)) {
      newlyUnlocked.push(id);
    }
  }
  return newlyUnlocked;
}

/**
 * Marks mode wins from current context + prior flags.
 */
export function resolveModesWon(
  prior: Record<GameMode, boolean>,
  ctx: Pick<
    AchievementContext,
    'mode' | 'maxTile' | 'justWon' | 'allTimeBestTile'
  >,
): Record<GameMode, boolean> {
  const next = { ...prior };
  if (ctx.justWon && ctx.mode === 'classic') {
    next.classic = true;
  }
  if (ctx.justWon && ctx.mode === 'challenge') {
    next.challenge = true;
  }
  if (ctx.justWon && ctx.mode === 'time-attack') {
    next['time-attack'] = true;
  }
  if (
    ctx.allTimeBestTile >= ACHIEVEMENT_ENDLESS_WIN_TILE ||
    (ctx.mode === 'endless' && ctx.maxTile >= ACHIEVEMENT_ENDLESS_WIN_TILE)
  ) {
    next.endless = true;
  }
  return next;
}

export interface BuildAchievementContextInput {
  board: Board;
  boardSize: number;
  mode: GameMode;
  score: number;
  moveCount: number;
  sessionDurationMs: number;
  undosUsed: number;
  maxTile: CellValue;
  continuedAfterWin: boolean;
  status: AchievementContext['status'];
  totalGames: number;
  currentWinStreak: number;
  longestWinStreak: number;
  currentPlayStreakDays: number;
  longestPlayStreakDays: number;
  consecutiveLossesBeforeWin: number;
  modesWon: Record<GameMode, boolean>;
  allTimeBestTile: CellValue;
  justWon: boolean;
  justLost: boolean;
  hasPlayedMove: boolean;
}

/**
 * Builds a frozen achievement evaluation context.
 */
export function buildAchievementContext(
  input: BuildAchievementContextInput,
): AchievementContext {
  return {
    board: input.board,
    boardSize: input.boardSize,
    mode: input.mode,
    score: input.score,
    moveCount: input.moveCount,
    sessionDurationMs: input.sessionDurationMs,
    undosUsed: input.undosUsed,
    maxTile: input.maxTile,
    continuedAfterWin: input.continuedAfterWin,
    status: input.status,
    totalGames: input.totalGames,
    currentWinStreak: input.currentWinStreak,
    longestWinStreak: input.longestWinStreak,
    currentPlayStreakDays: input.currentPlayStreakDays,
    longestPlayStreakDays: input.longestPlayStreakDays,
    consecutiveLossesBeforeWin: input.consecutiveLossesBeforeWin,
    modesWon: input.modesWon,
    allTimeBestTile: input.allTimeBestTile,
    justWon: input.justWon,
    justLost: input.justLost,
    hasPlayedMove: input.hasPlayedMove,
  };
}
