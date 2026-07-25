/**
 * @file achievementStore.ts
 * @layer store
 * @description Achievement unlock map (P-09 scaffold / P-12).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { ACHIEVEMENT_IDS, STORAGE_KEYS } from '@/constants';
import type { AchievementId, AchievementStatus, AchievementStore } from '@/types';

import { analytics } from './middleware/analytics.middleware';

function createLockedStatuses(): Record<AchievementId, AchievementStatus> {
  const statuses = {} as Record<AchievementId, AchievementStatus>;
  for (const id of ACHIEVEMENT_IDS) {
    statuses[id] = 'locked';
  }
  return statuses;
}

/**
 * Achievement store — entire status map persisted.
 */
export const useAchievementStore = create<AchievementStore>()(
  devtools(
    persist(
      analytics((set, get) => ({
        statuses: createLockedStatuses(),
        unlock: (id) => {
          const statuses = { ...get().statuses, [id]: 'unlocked' as const };
          set({ statuses });
        },
        resetAchievements: () => set({ statuses: createLockedStatuses() }),
      })),
      {
        name: STORAGE_KEYS.ACHIEVEMENTS,
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({ statuses: state.statuses }),
      },
    ),
    { name: 'achievementStore', enabled: __DEV__ },
  ),
);
