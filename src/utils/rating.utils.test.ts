/**
 * @file rating.utils.test.ts
 * @layer utils
 * @description Rating prompt gates (P-20).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';

import { RATING_PROMPT_AFTER_WINS } from '@/constants';
import { useStatsStore } from '@/store/statsStore';
import { createEmptyGameStats, createEmptyStatsByMode } from '@/utils/statsDefaults';
import {
  getLifetimeWinCount,
  maybeRequestReviewAfterWin,
  resetRatingForTests,
  setRatingPromptShownForTests,
} from '@/utils/rating.utils';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual(
    '@react-native-async-storage/async-storage/jest/async-storage-mock',
  ),
);

describe('rating.utils', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    resetRatingForTests();
    jest.clearAllMocks();
    useStatsStore.setState({
      byMode: createEmptyStatsByMode(),
    });
  });

  it('does not prompt before the third win', async () => {
    useStatsStore.setState({
      byMode: {
        ...createEmptyStatsByMode(),
        classic: {
          ...createEmptyGameStats('classic'),
          wins: RATING_PROMPT_AFTER_WINS - 1,
        },
      },
    });
    expect(getLifetimeWinCount()).toBe(2);
    await expect(maybeRequestReviewAfterWin()).resolves.toBe(false);
    expect(StoreReview.requestReview).not.toHaveBeenCalled();
  });

  it('prompts on the third win and not before', async () => {
    useStatsStore.setState({
      byMode: {
        ...createEmptyStatsByMode(),
        classic: {
          ...createEmptyGameStats('classic'),
          wins: RATING_PROMPT_AFTER_WINS,
        },
      },
    });
    await expect(maybeRequestReviewAfterWin()).resolves.toBe(true);
    expect(StoreReview.requestReview).toHaveBeenCalledTimes(1);
  });

  it('does not prompt again after shown', async () => {
    setRatingPromptShownForTests(true);
    useStatsStore.setState({
      byMode: {
        ...createEmptyStatsByMode(),
        classic: {
          ...createEmptyGameStats('classic'),
          wins: RATING_PROMPT_AFTER_WINS,
        },
      },
    });
    await expect(maybeRequestReviewAfterWin()).resolves.toBe(false);
    expect(StoreReview.requestReview).not.toHaveBeenCalled();
  });
});
