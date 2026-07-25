/**
 * @file useScoreCounter.ts
 * @layer hooks
 * @description Rolling score SharedValue (not a snap jump) — P-07.
 */

import { useEffect } from 'react';
import {
  Easing,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { REDUCED_MOTION_DURATION_MS, SCORE_ROLL_DURATION_MS } from '@/constants';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Animates a shared score value toward `target` whenever it changes.
 * @param target - Latest score from game state
 */
export function useScoreCounter(target: number): SharedValue<number> {
  const reducedMotion = useReducedMotion();
  const value = useSharedValue(target);

  useEffect(() => {
    const duration = reducedMotion
      ? REDUCED_MOTION_DURATION_MS
      : SCORE_ROLL_DURATION_MS;
    if (duration === 0) {
      value.value = target;
      return;
    }
    value.value = withTiming(target, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [target, reducedMotion, value]);

  return value;
}
