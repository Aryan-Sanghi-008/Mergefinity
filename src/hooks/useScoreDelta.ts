/**
 * @file useScoreDelta.ts
 * @layer hooks
 * @description Floating +N score delta animation (P-07).
 */

import { useCallback, useState } from 'react';
import {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { REDUCED_MOTION_DURATION_MS, SCORE_DELTA_DURATION_MS, SCORE_DELTA_TRAVEL_DP } from '@/constants';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface UseScoreDeltaResult {
  /** Latest delta amount (0 when hidden). */
  amount: number;
  /** Whether the float label should mount. */
  visible: boolean;
  /** Trigger a +N float. */
  play: (delta: number) => void;
  /** Reanimated style for the float label. */
  animatedStyle: ReturnType<typeof useAnimatedStyle>;
}

/**
 * Spawns a +N label that translates up and fades out.
 */
export function useScoreDelta(): UseScoreDeltaResult {
  const reducedMotion = useReducedMotion();
  const [amount, setAmount] = useState(0);
  const [visible, setVisible] = useState(false);
  const progress = useSharedValue(0);

  const hide = useCallback(() => {
    setVisible(false);
    setAmount(0);
  }, []);

  const play = useCallback(
    (delta: number) => {
      if (delta <= 0) {
        return;
      }
      setAmount(delta);
      setVisible(true);
      progress.set(0);
      const duration = reducedMotion
        ? REDUCED_MOTION_DURATION_MS
        : SCORE_DELTA_DURATION_MS;
      if (duration === 0) {
        hide();
        return;
      }
      progress.set(
        withTiming(1, { duration, easing: Easing.out(Easing.quad) }, (finished) => {
          if (finished) {
            runOnJS(hide)();
          }
        }),
      );
    },
    [hide, progress, reducedMotion],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.get(),
    transform: [{ translateY: -SCORE_DELTA_TRAVEL_DP * progress.get() }],
  }));

  return { amount, visible, play, animatedStyle };
}
