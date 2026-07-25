/**
 * @file useAchievementQueue.ts
 * @layer hooks
 * @description FIFO queue for achievement unlock toasts (P-12).
 */

import { useCallback, useState } from 'react';

import type { AchievementId } from '@/types';
import {
  dismissAchievement,
  enqueueAchievements,
  type AchievementQueueState,
} from '@/utils/achievementQueue';

export interface UseAchievementQueueResult {
  /** Currently displayed achievement id, or null. */
  currentId: AchievementId | null;
  /** Enqueue one or more unlock ids. */
  enqueue: (ids: readonly AchievementId[]) => void;
  /** Dismiss current toast and show the next queued id. */
  dismiss: () => void;
}

const INITIAL: AchievementQueueState = { currentId: null, pending: [] };

/**
 * Shows one achievement toast at a time; next starts after dismiss.
 */
export function useAchievementQueue(): UseAchievementQueueResult {
  const [state, setState] = useState<AchievementQueueState>(INITIAL);

  const enqueue = useCallback((ids: readonly AchievementId[]) => {
    setState((prev) => enqueueAchievements(prev, ids));
  }, []);

  const dismiss = useCallback(() => {
    setState((prev) => dismissAchievement(prev));
  }, []);

  return { currentId: state.currentId, enqueue, dismiss };
}
