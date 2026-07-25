/**
 * @file ads.utils.ts
 * @layer utils
 * @description Stub AdManager — consent, interstitial eligibility, banners (P-16).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  INTERSTITIAL_EVERY_N_LOSSES,
  STORAGE_KEYS,
} from '@/constants';
import { usePurchaseStore } from '@/store/purchaseStore';
import { useStatsStore } from '@/store/statsStore';

/** Consent outcome after the stub UMP prompt. */
export type AdsConsentStatus = 'unset' | 'personalized' | 'non_personalized';

export interface InterstitialEligibilityInput {
  /** Terminal outcome for this game-over. */
  outcome: 'win' | 'loss';
  /** Lifetime totalGames *before* this terminal record (0 = first game). */
  priorTotalGames: number;
}

let consentStatus: AdsConsentStatus = 'unset';
let lossCounter = 0;
let hydrated = false;
let interstitialPreloaded = false;
let lastShowResult: 'shown' | 'skipped' | null = null;

/** Optional UI bridge for consent prompt (set by useAds). */
let consentPrompter: (() => Promise<'personalized' | 'non_personalized'>) | null =
  null;

/**
 * Register a UI callback that resolves consent (Alert / dialog).
 */
export function setConsentPrompter(
  prompter: (() => Promise<'personalized' | 'non_personalized'>) | null,
): void {
  consentPrompter = prompter;
}

async function hydrate(): Promise<void> {
  if (hydrated) {
    return;
  }
  try {
    const [consentRaw, lossRaw] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.ADS_CONSENT),
      AsyncStorage.getItem(STORAGE_KEYS.ADS_LOSS_COUNTER),
    ]);
    if (
      consentRaw === 'personalized' ||
      consentRaw === 'non_personalized' ||
      consentRaw === 'unset'
    ) {
      consentStatus = consentRaw;
    }
    if (lossRaw !== null) {
      const parsed = Number.parseInt(lossRaw, 10);
      if (!Number.isNaN(parsed) && parsed >= 0) {
        lossCounter = parsed;
      }
    }
  } catch {
    // best-effort
  }
  hydrated = true;
}

async function persistConsent(status: AdsConsentStatus): Promise<void> {
  consentStatus = status;
  await AsyncStorage.setItem(STORAGE_KEYS.ADS_CONSENT, status);
}

async function persistLossCounter(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.ADS_LOSS_COUNTER, String(lossCounter));
}

/**
 * Ensure consent is resolved before any ad. Returns whether personalized allowed.
 */
export async function ensureConsentResolved(): Promise<AdsConsentStatus> {
  await hydrate();
  if (consentStatus !== 'unset') {
    return consentStatus;
  }
  const decision =
    consentPrompter !== null
      ? await consentPrompter()
      : 'non_personalized';
  await persistConsent(decision);
  return consentStatus;
}

/**
 * @returns Whether banners may render (not removed, consent resolved).
 */
export async function isBannerAllowed(): Promise<boolean> {
  await hydrate();
  if (usePurchaseStore.getState().hasRemovedAds) {
    return false;
  }
  await ensureConsentResolved();
  return !usePurchaseStore.getState().hasRemovedAds;
}

/**
 * Synchronous banner check after consent already resolved (hooks).
 */
export function isBannerAllowedSync(): boolean {
  if (usePurchaseStore.getState().hasRemovedAds) {
    return false;
  }
  return consentStatus !== 'unset';
}

/**
 * Preload interstitial after game start (stub: marks ready).
 */
export function preloadInterstitial(): void {
  if (usePurchaseStore.getState().hasRemovedAds) {
    interstitialPreloaded = false;
    return;
  }
  interstitialPreloaded = true;
}

/**
 * Pure eligibility for interstitial (exported for tests).
 */
export function isInterstitialEligible(
  input: InterstitialEligibilityInput,
  options: {
    hasRemovedAds: boolean;
    lossCountAfterIncrement: number;
  },
): boolean {
  if (input.outcome !== 'loss') {
    return false;
  }
  if (options.hasRemovedAds) {
    return false;
  }
  if (input.priorTotalGames < 1) {
    return false;
  }
  return (
    options.lossCountAfterIncrement > 0 &&
    options.lossCountAfterIncrement % INTERSTITIAL_EVERY_N_LOSSES === 0
  );
}

/**
 * Attempt interstitial on loss. Never on win / first game / remove-ads.
 */
export async function showInterstitialIfEligible(
  input: InterstitialEligibilityInput,
): Promise<'shown' | 'skipped'> {
  await hydrate();
  if (input.outcome !== 'loss') {
    lastShowResult = 'skipped';
    return 'skipped';
  }
  if (usePurchaseStore.getState().hasRemovedAds) {
    lastShowResult = 'skipped';
    return 'skipped';
  }

  await ensureConsentResolved();

  lossCounter += 1;
  await persistLossCounter();

  const eligible = isInterstitialEligible(input, {
    hasRemovedAds: usePurchaseStore.getState().hasRemovedAds,
    lossCountAfterIncrement: lossCounter,
  });

  if (!eligible || !interstitialPreloaded) {
    lastShowResult = 'skipped';
    return 'skipped';
  }

  // Stub: no native creative. Mark consumed so next preload is needed.
  interstitialPreloaded = false;
  lastShowResult = 'shown';
  return 'shown';
}

/**
 * Convenience: priorTotalGames from stats before recording, or after − 1.
 */
export function priorTotalGamesFromStats(): number {
  const total = useStatsStore.getState().lifetime.totalGames;
  return Math.max(0, total - 1);
}

/** Test helpers. */
export function resetAdsStateForTests(): void {
  consentStatus = 'unset';
  lossCounter = 0;
  hydrated = false;
  interstitialPreloaded = false;
  lastShowResult = null;
  consentPrompter = null;
}

export function getAdsDebugStateForTests(): {
  consentStatus: AdsConsentStatus;
  lossCounter: number;
  interstitialPreloaded: boolean;
  lastShowResult: 'shown' | 'skipped' | null;
} {
  return {
    consentStatus,
    lossCounter,
    interstitialPreloaded,
    lastShowResult,
  };
}

export async function setConsentForTests(
  status: AdsConsentStatus,
): Promise<void> {
  await persistConsent(status);
  hydrated = true;
}

export async function setLossCounterForTests(count: number): Promise<void> {
  lossCounter = count;
  await persistLossCounter();
  hydrated = true;
}
