/**
 * @file statsStore.ts
 * @layer store
 * @description Lifetime / per-mode stats + session history (P-09 scaffold / P-11).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { MAX_SESSION_HISTORY, STORAGE_KEYS } from '@/constants';
import type { StatsStore } from '@/types';
import {
  createEmptyLifetimeStats,
  createEmptyStatsByMode,
} from '@/utils/statsDefaults';

import { analytics } from './middleware/analytics.middleware';

/**
 * Stats store — lifetime + byMode persisted; session history capped.
 */
export const useStatsStore = create<StatsStore>()(
  devtools(
    persist(
      analytics((set) => ({
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
