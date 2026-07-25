/**
 * @file purchaseStore.ts
 * @layer store
 * @description IAP entitlement flags (P-09 scaffold / P-16).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants';
import type { PurchaseStore } from '@/types';

import { analytics } from './middleware/analytics.middleware';

/**
 * Purchase store — entitlements fully persisted.
 */
export const usePurchaseStore = create<PurchaseStore>()(
  devtools(
    persist(
      analytics((set) => ({
        hasRemovedAds: false,
        hasPremiumThemes: false,
        setHasRemovedAds: (value) => set({ hasRemovedAds: value }),
        setHasPremiumThemes: (value) => set({ hasPremiumThemes: value }),
      })),
      {
        name: STORAGE_KEYS.IAP_ENTITLEMENTS,
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          hasRemovedAds: state.hasRemovedAds,
          hasPremiumThemes: state.hasPremiumThemes,
        }),
      },
    ),
    { name: 'purchaseStore', enabled: __DEV__ },
  ),
);
