/**
 * @file ads.utils.test.ts
 * @layer utils
 * @description Interstitial eligibility and consent gates (P-16).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { INTERSTITIAL_EVERY_N_LOSSES } from '@/constants';
import { usePurchaseStore } from '@/store/purchaseStore';
import { useStatsStore } from '@/store/statsStore';
import {
  ensureConsentResolved,
  getAdsDebugStateForTests,
  isBannerAllowed,
  isInterstitialEligible,
  preloadInterstitial,
  resetAdsStateForTests,
  setConsentForTests,
  setConsentPrompter,
  setLossCounterForTests,
  showInterstitialIfEligible,
} from '@/utils/ads.utils';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual(
    '@react-native-async-storage/async-storage/jest/async-storage-mock',
  ),
);

describe('isInterstitialEligible', () => {
  it('blocks wins', () => {
    expect(
      isInterstitialEligible(
        { outcome: 'win', priorTotalGames: 5 },
        { hasRemovedAds: false, lossCountAfterIncrement: 3 },
      ),
    ).toBe(false);
  });

  it('blocks first completed game', () => {
    expect(
      isInterstitialEligible(
        { outcome: 'loss', priorTotalGames: 0 },
        { hasRemovedAds: false, lossCountAfterIncrement: 3 },
      ),
    ).toBe(false);
  });

  it('blocks when ads removed', () => {
    expect(
      isInterstitialEligible(
        { outcome: 'loss', priorTotalGames: 2 },
        { hasRemovedAds: true, lossCountAfterIncrement: 3 },
      ),
    ).toBe(false);
  });

  it('shows every Nth loss after first session', () => {
    expect(
      isInterstitialEligible(
        { outcome: 'loss', priorTotalGames: 1 },
        {
          hasRemovedAds: false,
          lossCountAfterIncrement: INTERSTITIAL_EVERY_N_LOSSES,
        },
      ),
    ).toBe(true);
    expect(
      isInterstitialEligible(
        { outcome: 'loss', priorTotalGames: 1 },
        { hasRemovedAds: false, lossCountAfterIncrement: 1 },
      ),
    ).toBe(false);
  });
});

describe('showInterstitialIfEligible', () => {
  beforeEach(async () => {
    resetAdsStateForTests();
    await AsyncStorage.clear();
    usePurchaseStore.setState({
      hasRemovedAds: false,
      hasPremiumThemes: false,
    });
    await setConsentForTests('non_personalized');
    await setLossCounterForTests(2);
    preloadInterstitial();
  });

  it('shows on the 3rd loss when eligible', async () => {
    const result = await showInterstitialIfEligible({
      outcome: 'loss',
      priorTotalGames: 2,
    });
    expect(result).toBe('shown');
  });

  it('skips when Remove Ads is owned', async () => {
    usePurchaseStore.setState({ hasRemovedAds: true });
    const result = await showInterstitialIfEligible({
      outcome: 'loss',
      priorTotalGames: 2,
    });
    expect(result).toBe('skipped');
  });
});

describe('consent after first completed game (P-19)', () => {
  beforeEach(async () => {
    resetAdsStateForTests();
    await AsyncStorage.clear();
    usePurchaseStore.setState({
      hasRemovedAds: false,
      hasPremiumThemes: false,
    });
    useStatsStore.setState({
      lifetime: {
        ...useStatsStore.getState().lifetime,
        totalGames: 0,
      },
    });
  });

  it('does not prompt or allow banners before first game', async () => {
    const prompter = jest.fn(async () => 'personalized' as const);
    setConsentPrompter(prompter);
    await expect(ensureConsentResolved()).resolves.toBe('unset');
    expect(prompter).not.toHaveBeenCalled();
    await expect(isBannerAllowed()).resolves.toBe(false);
    expect(getAdsDebugStateForTests().consentStatus).toBe('unset');
  });

  it('prompts once a game has been completed', async () => {
    useStatsStore.setState({
      lifetime: {
        ...useStatsStore.getState().lifetime,
        totalGames: 1,
      },
    });
    const prompter = jest.fn(async () => 'non_personalized' as const);
    setConsentPrompter(prompter);
    await expect(ensureConsentResolved()).resolves.toBe('non_personalized');
    expect(prompter).toHaveBeenCalledTimes(1);
    await expect(isBannerAllowed()).resolves.toBe(true);
  });
});
