/**
 * @file useOverlayAnimation.ts
 * @layer hooks
 * @description Win / game-over overlay enter motion (P-07).
 */

import { useEffect } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {
  OVERLAY_DURATION_MS,
  REDUCED_MOTION_DURATION_MS,
  WIN_CARD_OVERSHOOT_SCALE,
} from '@/constants';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { OVERLAY_ANIMATION, SPACING_TOKENS } from '@/styles';

export interface UseOverlayAnimationParams {
  /** Whether the overlay is shown. */
  visible: boolean;
  /** Win card gets a brief scale overshoot; game-over does not. */
  withScaleOvershoot?: boolean;
}

export interface UseOverlayAnimationResult {
  /** Scrim opacity style. */
  scrimStyle: ReturnType<typeof useAnimatedStyle>;
  /** Card translate / scale style. */
  cardStyle: ReturnType<typeof useAnimatedStyle>;
}

/**
 * Opacity 0→1 + translateY 20→0; optional win-card scale overshoot.
 */
export function useOverlayAnimation({
  visible,
  withScaleOvershoot = false,
}: UseOverlayAnimationParams): UseOverlayAnimationResult {
  const reducedMotion = useReducedMotion();
  const translateFrom: number = OVERLAY_ANIMATION.translateFromDp;
  const opacity = useSharedValue(0);
  const translateY = useSharedValue<number>(translateFrom);
  const scale = useSharedValue(1);

  useEffect(() => {
    const duration = reducedMotion
      ? REDUCED_MOTION_DURATION_MS
      : OVERLAY_DURATION_MS;

    if (!visible) {
      opacity.value = 0;
      translateY.value = translateFrom;
      scale.value = 1;
      return;
    }

    if (duration === 0) {
      opacity.value = 1;
      translateY.value = 0;
      scale.value = 1;
      return;
    }

    opacity.value = withTiming(1, { duration, easing: Easing.out(Easing.quad) });
    translateY.value = withTiming(0, {
      duration,
      easing: Easing.out(Easing.quad),
    });

    if (withScaleOvershoot && !reducedMotion) {
      scale.value = withSequence(
        withTiming(WIN_CARD_OVERSHOOT_SCALE, {
          duration: duration / SPACING_TOKENS.LAYOUT_DOUBLE,
        }),
        withSpring(1, { damping: 14, stiffness: 180 }),
      );
    } else {
      scale.value = 1;
    }
  }, [visible, withScaleOvershoot, reducedMotion, opacity, translateY, scale, translateFrom]);

  const scrimStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return { scrimStyle, cardStyle };
}
