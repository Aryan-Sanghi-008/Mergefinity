/**
 * @file useAchievements.ts
 * @layer hooks
 * @description Gallery selectors for the achievements screen (P-12).
 */

import { useMemo } from 'react';

import { ACHIEVEMENT_IDS, MODE_CONFIG, STRINGS } from '@/constants';
import { useAchievementStore } from '@/store/achievementStore';
import { useGameStore } from '@/store/gameStore';
import { useStatsStore } from '@/store/statsStore';
import type { AchievementId, AchievementProgress } from '@/types';
import {
  ACHIEVEMENTS_CONFIG,
  buildAchievementContext,
} from '@/utils/achievementChecks';
import { maxBoardTile } from '@/utils/statsHelpers';

export interface AchievementGalleryItem {
  id: AchievementId;
  name: string;
  description: string;
  status: AchievementProgress['status'];
  unlockedLabel?: string;
  progressLabel?: string;
}

export interface UseAchievementsResult {
  /** Cards for the gallery. */
  items: AchievementGalleryItem[];
  /** Unlocked count. */
  unlockedCount: number;
  /** Total roster size. */
  totalCount: number;
}

/**
 * Builds gallery rows with live progress for locked achievements.
 */
export function useAchievements(): UseAchievementsResult {
  const progress = useAchievementStore((s) => s.progress);
  const lifetime = useStatsStore((s) => s.lifetime);
  const board = useGameStore((s) => s.board);
  const mode = useGameStore((s) => s.mode);
  const score = useGameStore((s) => s.score);
  const moveCount = useGameStore((s) => s.moveCount);
  const undosUsed = useGameStore((s) => s.undosUsed);
  const continuedAfterWin = useGameStore((s) => s.continuedAfterWin);
  const status = useGameStore((s) => s.status);

  const items = useMemo((): AchievementGalleryItem[] => {
    const config = MODE_CONFIG[mode];
    const maxTile = maxBoardTile(board);
    const ctx = buildAchievementContext({
      board,
      boardSize: config.boardSize,
      mode,
      score,
      moveCount,
      sessionDurationMs: 0,
      undosUsed,
      maxTile,
      continuedAfterWin,
      status,
      totalGames: lifetime.totalGames,
      currentWinStreak: lifetime.currentWinStreak,
      longestWinStreak: lifetime.longestWinStreak,
      currentPlayStreakDays: lifetime.currentPlayStreakDays,
      longestPlayStreakDays: lifetime.longestPlayStreakDays,
      consecutiveLossesBeforeWin: lifetime.consecutiveLosses,
      modesWon: lifetime.modesWon,
      allTimeBestTile: lifetime.allTimeBestTile,
      justWon: false,
      justLost: false,
      hasPlayedMove: moveCount > 0 || lifetime.totalGames > 0,
    });

    return ACHIEVEMENT_IDS.map((id) => {
      const definition = ACHIEVEMENTS_CONFIG[id];
      const row = progress[id];
      const unlocked = row?.status === 'unlocked';
      const item: AchievementGalleryItem = {
        id,
        name: definition.name,
        description: definition.description,
        status: unlocked ? 'unlocked' : 'locked',
      };
      if (unlocked && row?.unlockedAt !== undefined && row.unlockedAt > 0) {
        item.unlockedLabel = new Date(row.unlockedAt).toLocaleDateString(
          undefined,
          { month: 'short', day: 'numeric', year: 'numeric' },
        );
      } else if (unlocked) {
        item.unlockedLabel = STRINGS.ACHIEVEMENT_UNLOCKED;
      }
      if (
        !unlocked &&
        definition.progressTarget !== undefined &&
        definition.progress !== undefined
      ) {
        const current = definition.progress(ctx);
        item.progressLabel = `${current}${STRINGS.ACHIEVEMENT_PROGRESS_OF}${definition.progressTarget}`;
      }
      return item;
    });
  }, [
    progress,
    lifetime,
    board,
    mode,
    score,
    moveCount,
    undosUsed,
    continuedAfterWin,
    status,
  ]);

  const unlockedCount = items.filter((item) => item.status === 'unlocked').length;

  return {
    items,
    unlockedCount,
    totalCount: ACHIEVEMENT_IDS.length,
  };
}
