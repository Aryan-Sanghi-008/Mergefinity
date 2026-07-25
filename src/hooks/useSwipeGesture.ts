/**
 * @file useSwipeGesture.ts
 * @layer hooks
 * @description Pan swipe → Direction with animation lock (P-08).
 */

import { useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, type SharedValue } from 'react-native-reanimated';

import {
  SWIPE_MIN_DISTANCE,
  SWIPE_VELOCITY_THRESHOLD,
} from '@/constants';
import type { Direction } from '@/types';
import { resolveSwipeDirection } from '@/utils/swipeDirection';

export interface UseSwipeGestureParams {
  /** Called on JS thread when a swipe resolves. */
  onSwipe: (direction: Direction) => void;
  /** Animation lock — swipes discarded while true. */
  animationLock: SharedValue<boolean>;
}

/**
 * Builds a single-finger Pan gesture for all four directions.
 */
export function useSwipeGesture({
  onSwipe,
  animationLock,
}: UseSwipeGestureParams) {
  return useMemo(
    () =>
      Gesture.Pan()
        .maxPointers(1)
        .minDistance(SWIPE_MIN_DISTANCE)
        .minVelocity(SWIPE_VELOCITY_THRESHOLD)
        .onEnd((event) => {
          'worklet';
          if (animationLock.value) {
            return;
          }

          const direction = resolveSwipeDirection({
            translationX: event.translationX,
            translationY: event.translationY,
            velocityX: event.velocityX,
            velocityY: event.velocityY,
          });

          if (direction === null) {
            return;
          }

          runOnJS(onSwipe)(direction);
        }),
    [onSwipe, animationLock],
  );
}
