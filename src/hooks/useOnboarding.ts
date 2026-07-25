/**
 * @file useOnboarding.ts
 * @layer hooks
 * @description First-launch onboarding flag via AsyncStorage (P-19).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import { STORAGE_KEYS } from '@/constants';

export interface UseOnboardingResult {
  /** True after storage hydrate finishes. */
  hydrated: boolean;
  /** True while onboarding should be shown. */
  showOnboarding: boolean;
  /** Persist complete and hide overlay. */
  completeOnboarding: () => Promise<void>;
}

/**
 * Hydrates `ONBOARDING_COMPLETE` and exposes dismiss for first swipe.
 */
export function useOnboarding(): UseOnboardingResult {
  const [hydrated, setHydrated] = useState(false);
  const [complete, setComplete] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
        if (!cancelled) {
          setComplete(raw === '1' || raw === 'true');
        }
      } catch {
        if (!cancelled) {
          setComplete(false);
        }
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const completeOnboarding = useCallback(async () => {
    setComplete(true);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, '1');
    } catch {
      // keep UI dismissed even if persist fails
    }
  }, []);

  return {
    hydrated,
    showOnboarding: hydrated && !complete,
    completeOnboarding,
  };
}
