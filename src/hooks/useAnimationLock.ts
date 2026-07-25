/**
 * @file useAnimationLock.ts
 * @layer hooks
 * @description Shared-value animation lock until Zustand owns it in P-09.
 */

import { useCallback } from 'react';
import { useSharedValue, type SharedValue } from 'react-native-reanimated';

/** Animation lock API for gestures and move sequencing. */
export interface AnimationLock {
  /** True while slide/merge/spawn is in flight (read on UI thread). */
  locked: SharedValue<boolean>;
  /** Sets lock true (JS thread). */
  lock: () => void;
  /** Sets lock false (JS thread). */
  unlock: () => void;
}

/**
 * Creates an animation lock shared value. Gesture `onEnd` must read `locked`.
 */
export function useAnimationLock(): AnimationLock {
  const locked = useSharedValue(false);

  const lock = useCallback(() => {
    // Reanimated SharedValue mutation (not React state).
    // eslint-disable-next-line react-hooks/immutability -- intentional shared value write
    locked.value = true;
  }, [locked]);

  const unlock = useCallback(() => {
    // eslint-disable-next-line react-hooks/immutability -- intentional shared value write
    locked.value = false;
  }, [locked]);

  return { locked, lock, unlock };
}
