/**
 * @file settingsStore.ts
 * @layer store
 * @description Persisted settings (haptics, sound, theme, board size) — P-08 / P-09.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { BOARD_SIZE, STORAGE_KEYS } from '@/constants';
import { DEFAULT_THEME_NAME } from '@/styles';
import type { SettingsStore } from '@/types';

import { analytics } from './middleware/analytics.middleware';

/**
 * Settings store — everything persisted per game plan.
 * Components must not import this; use hooks in `hooks/`.
 */
export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      analytics((set) => ({
        theme: DEFAULT_THEME_NAME,
        hapticsEnabled: true,
        soundEnabled: true,
        boardSize: BOARD_SIZE,
        setHapticsEnabled: (enabled) => set({ hapticsEnabled: enabled }),
        setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
        setTheme: (theme) => set({ theme }),
        setBoardSize: (boardSize) => set({ boardSize }),
      })),
      {
        name: STORAGE_KEYS.SETTINGS,
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
    { name: 'settingsStore', enabled: __DEV__ },
  ),
);
