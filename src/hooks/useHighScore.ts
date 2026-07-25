/**
 * @file useHighScore.ts
 * @layer hooks
 * @description Targeted best-score selector from gameStore.
 */

import { useGameStore } from '@/store/gameStore';

/**
 * @returns Persisted best score for the active mode session.
 */
export function useHighScore(): number {
  return useGameStore((state) => state.bestScore);
}
