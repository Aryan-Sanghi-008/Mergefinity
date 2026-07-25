/**
 * @file useAnimatedTile.ts
 * @layer hooks
 * @description Per-tile Reanimated shared values: slide, merge pop, spawn (P-07).
 */

import { useEffect } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import {
  MERGE_POP_UP_DURATION_MS,
  MERGE_SCALE,
  REDUCED_MOTION_DURATION_MS,
  SLIDE_DURATION_MS,
  SPAWN_INITIAL_SCALE,
} from '@/constants';
import { MERGE_POP_ANIMATION, SPAWN_ANIMATION } from '@/styles';
import type { TileMotionPhase } from '@/types';

export interface UseAnimatedTileParams {
  /** Destination cell left (absolute within board). */
  left: number;
  /** Destination cell top. */
  top: number;
  /** Source cell left for slide (same as left when idle). */
  fromLeft: number;
  /** Source cell top for slide. */
  fromTop: number;
  /** Current motion phase. */
  phase: TileMotionPhase;
  /** Sequence bump to retrigger animations. */
  motionSeq: number;
  /** OS reduce-motion preference. */
  reducedMotion: boolean;
}

export interface UseAnimatedTileResult {
  /** Combined transform / opacity style for the tile wrapper. */
  animatedStyle: ReturnType<typeof useAnimatedStyle>;
  /** Exposed for tests / debugging. */
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  scale: SharedValue<number>;
  opacity: SharedValue<number>;
}

/**
 * Initializes translate/scale/opacity and runs phase animations on the UI thread.
 */
export function useAnimatedTile({
  left,
  top,
  fromLeft,
  fromTop,
  phase,
  motionSeq,
  reducedMotion,
}: UseAnimatedTileParams): UseAnimatedTileResult {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const slideMs = reducedMotion ? REDUCED_MOTION_DURATION_MS : SLIDE_DURATION_MS;
    const mergeUpMs = reducedMotion
      ? REDUCED_MOTION_DURATION_MS
      : MERGE_POP_UP_DURATION_MS;

    if (phase === 'spawn') {
      scale.value = SPAWN_INITIAL_SCALE;
      opacity.value = 0;
      translateX.value = 0;
      translateY.value = 0;
      if (reducedMotion) {
        scale.value = 1;
        opacity.value = 1;
        return;
      }
      scale.value = withSpring(1, SPAWN_ANIMATION.spring);
      opacity.value = withTiming(1, { duration: SPAWN_ANIMATION.durationMs });
      return;
    }

    if (phase === 'slide') {
      translateX.value = fromLeft - left;
      translateY.value = fromTop - top;
      translateX.value = withTiming(0, {
        duration: slideMs,
        easing: Easing.out(Easing.quad),
      });
      translateY.value = withTiming(0, {
        duration: slideMs,
        easing: Easing.out(Easing.quad),
      });
      return;
    }

    if (phase === 'merge') {
      translateX.value = 0;
      translateY.value = 0;
      if (reducedMotion) {
        scale.value = 1;
        return;
      }
      scale.value = withSequence(
        withTiming(MERGE_SCALE, { duration: mergeUpMs }),
        withSpring(1, MERGE_POP_ANIMATION.spring),
      );
      return;
    }

    if (phase === 'exit') {
      opacity.value = withTiming(0, {
        duration: reducedMotion ? REDUCED_MOTION_DURATION_MS : slideMs,
      });
      return;
    }

    translateX.value = 0;
    translateY.value = 0;
    scale.value = 1;
    opacity.value = 1;
  }, [
    phase,
    motionSeq,
    left,
    top,
    fromLeft,
    fromTop,
    reducedMotion,
    translateX,
    translateY,
    scale,
    opacity,
  ]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return { animatedStyle, translateX, translateY, scale, opacity };
}
