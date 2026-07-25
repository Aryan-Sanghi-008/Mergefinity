/**
 * @file statsStore.ts
 * @layer store
 * @description Lifetime / per-mode stats + session history (P-11 / P-12).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { MAX_SESSION_HISTORY, STORAGE_KEYS } from '@/constants';
import type {
  CellValue,
  GameMode,
  RecordGameEndPayload,
  SessionRecord,
  StatsStore,
} from '@/types';
import {
  createEmptyLifetimeStats,
  createEmptyStatsByMode,
} from '@/utils/statsDefaults';
import {
  applyPlayDayStreak,
  durationSecondsToPlayMinutes,
  formatPlayDayKey,
  resetByModePreservingBests,
  resetLifetimePreservingBests,
} from '@/utils/statsHelpers';

import { analytics } from './middleware/analytics.middleware';

/**
 * Stats store — lifetime + byMode (incl. per-mode bestScore) persisted.
 */
export const useStatsStore = create<StatsStore>()(
  devtools(
    persist(
      analytics((set, get) => ({
        byMode: createEmptyStatsByMode(),
        lifetime: createEmptyLifetimeStats(),
        sessionHistory: [],
        setSessionHistory: (sessions) =>
          set({
            sessionHistory: sessions.slice(-MAX_SESSION_HISTORY),
          }),
        resetStats: () => {
          const { byMode, lifetime } = get();
          set({
            byMode: resetByModePreservingBests(byMode),
            lifetime: resetLifetimePreservingBests(lifetime),
            sessionHistory: [],
          });
        },
        recordBestScore: (mode: GameMode, score: number) => {
          const current = get().byMode[mode];
          if (current === undefined || score <= current.bestScore) {
            return;
          }
          set({
            byMode: {
              ...get().byMode,
              [mode]: { ...current, bestScore: score },
            },
            lifetime: {
              ...get().lifetime,
              allTimeBestScore: Math.max(get().lifetime.allTimeBestScore, score),
            },
          });
        },
        getBestScore: (mode: GameMode) => get().byMode[mode]?.bestScore ?? 0,
        recordMerges: (mode: GameMode, values: readonly CellValue[]) => {
          if (values.length === 0) {
            return;
          }
          const current = get().byMode[mode];
          if (current === undefined) {
            return;
          }
          const mergeHistogram = { ...get().lifetime.mergeHistogram };
          for (const value of values) {
            if (value === 0) {
              continue;
            }
            mergeHistogram[value] = (mergeHistogram[value] ?? 0) + 1;
          }
          set({
            byMode: {
              ...get().byMode,
              [mode]: {
                ...current,
                totalMerges: current.totalMerges + values.length,
              },
            },
            lifetime: {
              ...get().lifetime,
              mergeHistogram,
            },
          });
        },
        recordGameEnd: (payload: RecordGameEndPayload) => {
          const { mode, outcome, score, bestTile, durationSeconds } = payload;
          const current = get().byMode[mode];
          if (current === undefined) {
            return;
          }

          const isWin = outcome === 'win';
          const lifetime = get().lifetime;
          const dayKey = formatPlayDayKey();
          const playStreak = applyPlayDayStreak(lifetime, dayKey);
          const currentWinStreak = isWin ? lifetime.currentWinStreak + 1 : 0;
          const longestWinStreak = Math.max(
            lifetime.longestWinStreak,
            currentWinStreak,
          );
          const playMinutes = durationSecondsToPlayMinutes(durationSeconds);
          const consecutiveLosses = isWin ? 0 : lifetime.consecutiveLosses + 1;
          const modesWon = { ...lifetime.modesWon };
          if (isWin && mode !== 'endless') {
            modesWon[mode] = true;
          }

          const session: SessionRecord = {
            mode,
            score,
            bestTile,
            durationSeconds,
            endedAt: Date.now(),
          };

          set({
            byMode: {
              ...get().byMode,
              [mode]: {
                ...current,
                gamesPlayed: current.gamesPlayed + 1,
                wins: current.wins + (isWin ? 1 : 0),
                losses: current.losses + (isWin ? 0 : 1),
                scoreSum: current.scoreSum + score,
                bestTile: Math.max(current.bestTile, bestTile) as CellValue,
                bestScore: Math.max(current.bestScore, score),
              },
            },
            lifetime: {
              ...lifetime,
              totalGames: lifetime.totalGames + 1,
              totalPlayMinutes: lifetime.totalPlayMinutes + playMinutes,
              allTimeBestScore: Math.max(lifetime.allTimeBestScore, score),
              allTimeBestTile: Math.max(
                lifetime.allTimeBestTile,
                bestTile,
              ) as CellValue,
              currentWinStreak,
              longestWinStreak,
              consecutiveLosses,
              modesWon,
              ...playStreak,
            },
            sessionHistory: [...get().sessionHistory, session].slice(
              -MAX_SESSION_HISTORY,
            ),
          });
        },
        setModesWon: (modesWon) => {
          set({
            lifetime: {
              ...get().lifetime,
              modesWon,
            },
          });
        },
      })),
      {
        name: STORAGE_KEYS.STATS,
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          byMode: state.byMode,
          lifetime: state.lifetime,
          sessionHistory: state.sessionHistory,
        }),
        merge: (persisted, current) => {
          const slice = persisted as Partial<StatsStore> | undefined;
          if (slice === undefined || slice === null) {
            return current;
          }
          const emptyLifetime = createEmptyLifetimeStats();
          const lifetime = {
            ...emptyLifetime,
            ...current.lifetime,
            ...slice.lifetime,
            modesWon: {
              ...emptyLifetime.modesWon,
              ...current.lifetime.modesWon,
              ...slice.lifetime?.modesWon,
            },
            consecutiveLosses:
              slice.lifetime?.consecutiveLosses ??
              current.lifetime.consecutiveLosses ??
              0,
          };
          if (lifetime.lastPlayDayKey === undefined) {
            lifetime.lastPlayDayKey = null;
          }
          return {
            ...current,
            ...slice,
            lifetime,
            byMode: {
              ...createEmptyStatsByMode(),
              ...current.byMode,
              ...slice.byMode,
            },
            sessionHistory: slice.sessionHistory ?? current.sessionHistory,
          };
        },
      },
    ),
    { name: 'statsStore', enabled: __DEV__ },
  ),
);
