/**
 * @file useSwipeGesture.ts
 * @layer hooks
 * @description Pan swipe → Direction (P-07 early pull of P-08 gesture).
 */

import { useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, type SharedValue } from 'react-native-reanimated';

import {
  SWIPE_MIN_DISTANCE,
  SWIPE_VELOCITY_DIAGONAL,
  SWIPE_VELOCITY_THRESHOLD,
} from '@/constants';
import type { Direction } from '@/types';

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

          const { translationX, translationY, velocityX, velocityY } = event;
          const absTx = Math.abs(translationX);
          const absTy = Math.abs(translationY);
          const absVx = Math.abs(velocityX);
          const absVy = Math.abs(velocityY);
          const speed = Math.hypot(velocityX, velocityY);

          let horizontal: boolean;
          if (speed > SWIPE_VELOCITY_DIAGONAL) {
            horizontal = absVx >= absVy;
          } else {
            horizontal = absTx >= absTy;
          }

          let direction: Direction;
          if (horizontal) {
            if (absTx < SWIPE_MIN_DISTANCE && absVx < SWIPE_VELOCITY_THRESHOLD) {
              return;
            }
            direction = translationX > 0 ? 'RIGHT' : 'LEFT';
          } else {
            if (absTy < SWIPE_MIN_DISTANCE && absVy < SWIPE_VELOCITY_THRESHOLD) {
              return;
            }
            direction = translationY > 0 ? 'DOWN' : 'UP';
          }

          runOnJS(onSwipe)(direction);
        }),
    [onSwipe, animationLock],
  );
}
