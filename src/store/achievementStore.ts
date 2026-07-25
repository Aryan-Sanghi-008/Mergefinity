/**
 * @file achievementStore.ts
 * @layer store
 * @description Achievement unlock map with timestamps (P-12).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { ACHIEVEMENT_IDS, STORAGE_KEYS } from '@/constants';
import type {
  AchievementId,
  AchievementProgress,
  AchievementStatus,
  AchievementStore,
} from '@/types';

import { analytics } from './middleware/analytics.middleware';

function createLockedProgress(): Record<AchievementId, AchievementProgress> {
  const progress = {} as Record<AchievementId, AchievementProgress>;
  for (const id of ACHIEVEMENT_IDS) {
    progress[id] = { id, status: 'locked' };
  }
  return progress;
}

/**
 * Achievement store — progress map persisted (migrates old `statuses` shape).
 */
export const useAchievementStore = create<AchievementStore>()(
  devtools(
    persist(
      analytics((set, get) => ({
        progress: createLockedProgress(),
        unlock: (id) => {
          const current = get().progress[id];
          if (current === undefined || current.status === 'unlocked') {
            return;
          }
          set({
            progress: {
              ...get().progress,
              [id]: {
                id,
                status: 'unlocked',
                unlockedAt: Date.now(),
              },
            },
          });
        },
        unlockMany: (ids) => {
          if (ids.length === 0) {
            return;
          }
          const progress = { ...get().progress };
          let changed = false;
          const now = Date.now();
          for (const id of ids) {
            const current = progress[id];
            if (current === undefined || current.status === 'unlocked') {
              continue;
            }
            progress[id] = {
              id,
              status: 'unlocked',
              unlockedAt: now,
            };
            changed = true;
          }
          if (changed) {
            set({ progress });
          }
        },
        resetAchievements: () => set({ progress: createLockedProgress() }),
      })),
      {
        name: STORAGE_KEYS.ACHIEVEMENTS,
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({ progress: state.progress }),
        merge: (persisted, current) => {
          const slice = persisted as
            | Partial<AchievementStore>
            | {
                statuses?: Record<AchievementId, AchievementStatus>;
                progress?: Record<AchievementId, AchievementProgress>;
              }
            | undefined;
          if (slice === undefined || slice === null) {
            return current;
          }

          const base = createLockedProgress();
          const fromProgress = slice.progress;
          if (fromProgress !== undefined) {
            for (const id of ACHIEVEMENT_IDS) {
              const row = fromProgress[id];
              if (row !== undefined) {
                base[id] = {
                  id,
                  status: row.status,
                  ...(row.unlockedAt !== undefined
                    ? { unlockedAt: row.unlockedAt }
                    : {}),
                };
              }
            }
            return { ...current, progress: base };
          }

          const legacy = (
            slice as { statuses?: Record<AchievementId, AchievementStatus> }
          ).statuses;
          if (legacy !== undefined) {
            for (const id of ACHIEVEMENT_IDS) {
              if (legacy[id] === 'unlocked') {
                base[id] = {
                  id,
                  status: 'unlocked',
                  unlockedAt: 0,
                };
              }
            }
          }
          return { ...current, progress: base };
        },
      },
    ),
    { name: 'achievementStore', enabled: __DEV__ },
  ),
);
