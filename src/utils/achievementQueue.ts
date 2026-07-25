/**
 * @file achievementQueue.ts
 * @layer utils
 * @description Pure FIFO helper for achievement toast sequencing (P-12).
 */

import type { AchievementId } from '@/types';

export interface AchievementQueueState {
  /** Id currently shown. */
  currentId: AchievementId | null;
  /** Waiting ids. */
  pending: AchievementId[];
}

/**
 * Enqueues unlock ids; promotes the first when idle.
 */
export function enqueueAchievements(
  state: AchievementQueueState,
  ids: readonly AchievementId[],
): AchievementQueueState {
  if (ids.length === 0) {
    return state;
  }
  if (state.currentId !== null) {
    return {
      currentId: state.currentId,
      pending: [...state.pending, ...ids],
    };
  }
  const [first, ...rest] = ids;
  return {
    currentId: first ?? null,
    pending: [...state.pending, ...rest],
  };
}

/**
 * Dismisses the current toast and promotes the next pending id.
 */
export function dismissAchievement(
  state: AchievementQueueState,
): AchievementQueueState {
  const [next, ...rest] = state.pending;
  return {
    currentId: next ?? null,
    pending: rest,
  };
}
