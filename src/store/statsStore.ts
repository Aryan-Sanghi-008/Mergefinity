/**
 * @file statsStore.ts
 * @layer store
 * @description Lifetime / per-mode stats + session history (P-09 / P-10 best scores).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { MAX_SESSION_HISTORY, STORAGE_KEYS } from '@/constants';
import type { GameMode, StatsStore } from '@/types';
import {
  createEmptyLifetimeStats,
  createEmptyStatsByMode,
} from '@/utils/statsDefaults';

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
        resetStats: () =>
          set({
            byMode: createEmptyStatsByMode(),
            lifetime: createEmptyLifetimeStats(),
            sessionHistory: [],
          }),
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
      })),
      {
        name: STORAGE_KEYS.STATS,
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          byMode: state.byMode,
          lifetime: state.lifetime,
          sessionHistory: state.sessionHistory,
        }),
      },
    ),
    { name: 'statsStore', enabled: __DEV__ },
  ),
);
