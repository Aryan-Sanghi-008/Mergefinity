/**
 * @file achievementQueue.test.ts
 * @layer utils
 * @description Queue advances only after dismiss (P-12 DoD).
 */

import type { AchievementQueueState } from './achievementQueue';
import { dismissAchievement, enqueueAchievements } from './achievementQueue';

describe('achievementQueue', () => {
  it('shows the second toast only after the first dismisses', () => {
    let state: AchievementQueueState = { currentId: null, pending: [] };
    state = enqueueAchievements(state, ['first_win', 'halfway_there']);
    expect(state.currentId).toBe('first_win');
    expect(state.pending).toEqual(['halfway_there']);

    state = dismissAchievement(state);
    expect(state.currentId).toBe('halfway_there');
    expect(state.pending).toEqual([]);

    state = dismissAchievement(state);
    expect(state.currentId).toBeNull();
  });
});
