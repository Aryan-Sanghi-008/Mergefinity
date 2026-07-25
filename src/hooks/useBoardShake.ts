/**
 * @file useBoardShake.ts
 * @layer hooks
 * @description Board edge pulse on blocked moves (P-07 primary no-op feedback).
 */

import { useCallback } from 'react';
import {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import {
  EDGE_PULSE_BORDER_WIDTH,
  EDGE_PULSE_IN_MS,
  EDGE_PULSE_OUT_MS,
  REDUCED_MOTION_DURATION_MS,
} from '@/constants';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTheme } from '@/hooks/useTheme';

export interface UseBoardShakeResult {
  /** Flash the board border to accent, then fade. */
  pulse: () => void;
  /** Animated border style for the board vessel. */
  animatedStyle: ReturnType<typeof useAnimatedStyle>;
}

/**
 * Edge-pulse (named shake in the plan file list). Not a full-board translate shake.
 */
export function useBoardShake(): UseBoardShakeResult {
  const { theme } = useTheme();
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(0);
  const accent = theme.ACCENT;
  const idleBorder = 'transparent';

  const pulse = useCallback(() => {
    const inMs = reducedMotion ? REDUCED_MOTION_DURATION_MS : EDGE_PULSE_IN_MS;
    const outMs = reducedMotion ? REDUCED_MOTION_DURATION_MS : EDGE_PULSE_OUT_MS;
    // eslint-disable-next-line react-hooks/immutability -- intentional shared value write
    progress.value = 0;
    if (inMs === 0 && outMs === 0) {
      return;
    }
    progress.value = withSequence(
      withTiming(1, { duration: inMs, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: outMs, easing: Easing.in(Easing.quad) }),
    );
  }, [progress, reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    borderWidth: EDGE_PULSE_BORDER_WIDTH,
    borderColor: interpolateColor(progress.value, [0, 1], [idleBorder, accent]),
  }));

  return { pulse, animatedStyle };
}
