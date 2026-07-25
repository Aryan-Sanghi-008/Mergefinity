/**
 * @file achievementStore.test.ts
 * @layer store
 * @description Idempotent unlock and legacy statuses migration (P-12).
 */

import { ACHIEVEMENT_IDS } from '@/constants';

import { useAchievementStore } from './achievementStore';

jest.mock('@/utils/sound.utils', () => ({
  SoundManager: {
    play: jest.fn(),
    playSlide: jest.fn(),
    setEnabled: jest.fn(),
    preload: jest.fn(async () => undefined),
  },
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual(
    '@react-native-async-storage/async-storage/jest/async-storage-mock',
  ),
);

describe('useAchievementStore', () => {
  beforeEach(() => {
    useAchievementStore.setState({
      progress: Object.fromEntries(
        ACHIEVEMENT_IDS.map((id) => [id, { id, status: 'locked' as const }]),
      ) as ReturnType<typeof useAchievementStore.getState>['progress'],
    });
  });

  it('unlock is idempotent and preserves unlockedAt', () => {
    useAchievementStore.getState().unlock('first_win');
    const firstAt = useAchievementStore.getState().progress.first_win?.unlockedAt;
    expect(useAchievementStore.getState().progress.first_win?.status).toBe(
      'unlocked',
    );
    expect(firstAt).toBeGreaterThan(0);

    useAchievementStore.getState().unlock('first_win');
    expect(useAchievementStore.getState().progress.first_win?.unlockedAt).toBe(
      firstAt,
    );
  });

  it('unlockMany unlocks several ids once', () => {
    useAchievementStore.getState().unlockMany(['halfway_there', 'first_win']);
    expect(useAchievementStore.getState().progress.halfway_there?.status).toBe(
      'unlocked',
    );
    expect(useAchievementStore.getState().progress.first_win?.status).toBe(
      'unlocked',
    );
  });
});
