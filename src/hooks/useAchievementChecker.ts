/**
 * @file useAchievementChecker.ts
 * @layer hooks
 * @description Evaluates achievements after game events (P-12).
 */

import { useCallback } from 'react';

import { MODE_CONFIG } from '@/constants';
import { useAchievementStore } from '@/store/achievementStore';
import { useGameStore } from '@/store/gameStore';
import { useStatsStore } from '@/store/statsStore';
import type { AchievementId } from '@/types';
import {
  buildAchievementContext,
  checkAndUnlock,
  resolveModesWon,
} from '@/utils/achievementChecks';
import { hapticAchievement } from '@/utils/haptics.utils';
import { maxBoardTile } from '@/utils/statsHelpers';

export interface EvaluateAchievementsOptions {
  /** Newly recorded win this tick. */
  justWon?: boolean;
  /** Newly recorded loss this tick. */
  justLost?: boolean;
  /**
   * Consecutive losses *before* a win was applied (Comeback).
   * When omitted, reads current lifetime.consecutiveLosses.
   */
  consecutiveLossesBeforeWin?: number;
}

/**
 * Builds context from stores, unlocks new achievements, returns new ids.
 */
export function evaluateAchievementsNow(
  options: EvaluateAchievementsOptions = {},
): AchievementId[] {
  const game = useGameStore.getState();
  const stats = useStatsStore.getState();
  const achievement = useAchievementStore.getState();
  const config = MODE_CONFIG[game.mode];
  const maxTile = maxBoardTile(game.board);
  const justWon = options.justWon === true;
  const justLost = options.justLost === true;

  const modesWon = resolveModesWon(stats.lifetime.modesWon, {
    mode: game.mode,
    maxTile,
    justWon,
    allTimeBestTile: Math.max(
      stats.lifetime.allTimeBestTile,
      maxTile,
    ) as typeof stats.lifetime.allTimeBestTile,
  });
  if (
    modesWon.classic !== stats.lifetime.modesWon.classic ||
    modesWon.endless !== stats.lifetime.modesWon.endless ||
    modesWon.challenge !== stats.lifetime.modesWon.challenge ||
    modesWon['time-attack'] !== stats.lifetime.modesWon['time-attack']
  ) {
    useStatsStore.getState().setModesWon(modesWon);
  }

  const alreadyUnlocked = unlockedIdsFromProgress(achievement.progress);

  const consecutiveLossesBeforeWin =
    options.consecutiveLossesBeforeWin ??
    (justWon ? 0 : stats.lifetime.consecutiveLosses);

  const ctx = buildAchievementContext({
    board: game.board,
    boardSize: config.boardSize,
    mode: game.mode,
    score: game.score,
    moveCount: game.moveCount,
    sessionDurationMs: Math.max(0, Date.now() - game.sessionStartedAt),
    undosUsed: game.undosUsed,
    maxTile,
    continuedAfterWin: game.continuedAfterWin,
    status: game.status,
    totalGames: stats.lifetime.totalGames,
    currentWinStreak: stats.lifetime.currentWinStreak,
    longestWinStreak: stats.lifetime.longestWinStreak,
    currentPlayStreakDays: stats.lifetime.currentPlayStreakDays,
    longestPlayStreakDays: stats.lifetime.longestPlayStreakDays,
    consecutiveLossesBeforeWin,
    modesWon,
    allTimeBestTile: Math.max(stats.lifetime.allTimeBestTile, maxTile) as typeof maxTile,
    justWon,
    justLost,
    hasPlayedMove: game.moveCount > 0 || stats.lifetime.totalGames > 0,
  });

  const newlyUnlocked = checkAndUnlock(ctx, alreadyUnlocked);
  if (newlyUnlocked.length > 0) {
    useAchievementStore.getState().unlockMany(newlyUnlocked);
    hapticAchievement();
  }
  return newlyUnlocked;
}

function unlockedIdsFromProgress(
  progress: ReturnType<typeof useAchievementStore.getState>['progress'],
): AchievementId[] {
  return Object.values(progress)
    .filter((row) => row.status === 'unlocked')
    .map((row) => row.id);
}

/**
 * Hook wrapper returning a stable evaluate callback for the game engine.
 */
export function useAchievementChecker(): (
  options?: EvaluateAchievementsOptions,
) => AchievementId[] {
  return useCallback((options?: EvaluateAchievementsOptions) => {
    return evaluateAchievementsNow(options);
  }, []);
}
