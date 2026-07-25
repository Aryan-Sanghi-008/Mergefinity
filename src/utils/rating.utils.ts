/**
 * @file rating.utils.ts
 * @layer utils
 * @description Play Store rating prompt after the 3rd lifetime win (P-20).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';

import { RATING_PROMPT_AFTER_WINS, STORAGE_KEYS } from '@/constants';
import { useStatsStore } from '@/store/statsStore';
import type { GameStats } from '@/types';
import { logDebug } from '@/utils/logger.utils';

let hydrated = false;
let promptShown = false;

async function hydrate(): Promise<void> {
  if (hydrated) {
    return;
  }
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.RATING_PROMPT_SHOWN);
    promptShown = raw === '1';
  } catch {
    promptShown = false;
  }
  hydrated = true;
}

async function persistShown(): Promise<void> {
  promptShown = true;
  await AsyncStorage.setItem(STORAGE_KEYS.RATING_PROMPT_SHOWN, '1');
}

/**
 * Sum wins across all modes.
 */
export function getLifetimeWinCount(): number {
  const { byMode } = useStatsStore.getState();
  return (Object.values(byMode) as GameStats[]).reduce(
    (sum, stats) => sum + stats.wins,
    0,
  );
}

/**
 * After a win is recorded, request a review exactly at the 3rd lifetime win.
 * Never prompts before the 3rd win; never prompts again after shown.
 */
export async function maybeRequestReviewAfterWin(): Promise<boolean> {
  await hydrate();
  if (promptShown) {
    return false;
  }
  const wins = getLifetimeWinCount();
  if (wins < RATING_PROMPT_AFTER_WINS) {
    return false;
  }

  const available = await StoreReview.isAvailableAsync();
  if (!available) {
    logDebug('[rating] StoreReview unavailable — marking shown');
    await persistShown();
    return false;
  }

  await StoreReview.requestReview();
  await persistShown();
  logDebug('[rating] review requested at win', wins);
  return true;
}

/**
 * Test helper — reset prompt state.
 */
export function resetRatingForTests(): void {
  hydrated = false;
  promptShown = false;
}

/**
 * Test helper — seed hydrated prompt flag without AsyncStorage.
 */
export function setRatingPromptShownForTests(shown: boolean): void {
  hydrated = true;
  promptShown = shown;
}
