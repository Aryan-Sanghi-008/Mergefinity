/**
 * @file useStats.ts
 * @layer hooks
 * @description Statistics selectors and derived metrics (P-11).
 */

import { useCallback, useMemo, useState } from 'react';

import { useStatsStore } from '@/store/statsStore';
import type {
  CellValue,
  GameMode,
  GameStats,
  LifetimeStats,
  SessionRecord,
} from '@/types';
import { averageScore, computeWinRate } from '@/utils/statsHelpers';

export interface ModeStatsView {
  /** Per-mode aggregates. */
  stats: GameStats;
  /** Win rate percent (integer). */
  winRate: number;
  /** Average end score (integer). */
  average: number;
}

export interface MergeHistogramRow {
  /** Tile value. */
  value: CellValue;
  /** Merge count. */
  count: number;
  /** Width fraction 0–1 relative to max count. */
  fraction: number;
}

export interface UseStatsResult {
  /** Mode filter for per-mode rows. */
  selectedMode: GameMode;
  /** Change mode filter. */
  setSelectedMode: (mode: GameMode) => void;
  /** Derived view for the selected mode. */
  modeStats: ModeStatsView;
  /** Lifetime aggregates. */
  lifetime: LifetimeStats;
  /** Recent sessions, newest first. */
  sessionHistory: SessionRecord[];
  /** Histogram rows for the merge chart. */
  mergeRows: MergeHistogramRow[];
  /** Whether the selected mode has any games. */
  isModeEmpty: boolean;
  /** Reset stats (preserves bests). */
  resetStats: () => void;
}

/**
 * Wires statsStore for the Statistics screen.
 */
export function useStats(): UseStatsResult {
  const [selectedMode, setSelectedMode] = useState<GameMode>('classic');
  const byMode = useStatsStore((s) => s.byMode);
  const lifetime = useStatsStore((s) => s.lifetime);
  const sessionHistoryRaw = useStatsStore((s) => s.sessionHistory);
  const resetStatsAction = useStatsStore((s) => s.resetStats);

  const modeStats = useMemo((): ModeStatsView => {
    const stats = byMode[selectedMode];
    return {
      stats,
      winRate: computeWinRate(stats.wins, stats.gamesPlayed),
      average: averageScore(stats.scoreSum, stats.gamesPlayed),
    };
  }, [byMode, selectedMode]);

  const sessionHistory = useMemo(
    () => [...sessionHistoryRaw].reverse(),
    [sessionHistoryRaw],
  );

  const mergeRows = useMemo((): MergeHistogramRow[] => {
    const entries = Object.entries(lifetime.mergeHistogram)
      .map(([key, count]) => ({
        value: Number(key) as CellValue,
        count: count ?? 0,
      }))
      .filter((row) => row.count > 0)
      .sort((a, b) => a.value - b.value);
    const maxCount = entries.reduce((max, row) => Math.max(max, row.count), 0);
    return entries.map((row) => ({
      ...row,
      fraction: maxCount > 0 ? row.count / maxCount : 0,
    }));
  }, [lifetime.mergeHistogram]);

  const resetStats = useCallback(() => {
    resetStatsAction();
  }, [resetStatsAction]);

  return {
    selectedMode,
    setSelectedMode,
    modeStats,
    lifetime,
    sessionHistory,
    mergeRows,
    isModeEmpty: modeStats.stats.gamesPlayed === 0,
    resetStats,
  };
}

/**
 * @returns Stats reset action (preserves best scores).
 */
export function useResetStats(): () => void {
  return useStatsStore((state) => state.resetStats);
}
