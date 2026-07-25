/**
 * @file swipeDirection.ts
 * @layer utils
 * @description Pure swipe direction resolution for Pan onEnd (P-08).
 */

import {
  SWIPE_MIN_DISTANCE,
  SWIPE_VELOCITY_DIAGONAL,
  SWIPE_VELOCITY_THRESHOLD,
} from '@/constants';
import type { Direction } from '@/types';

/** Pan end metrics used to resolve a swipe. */
export interface SwipePanEvent {
  translationX: number;
  translationY: number;
  velocityX: number;
  velocityY: number;
}

/**
 * Resolves UP/DOWN/LEFT/RIGHT from translation + velocity, or null for a tap.
 * Marked as a worklet so Reanimated can call it from `onEnd`.
 */
export function resolveSwipeDirection(event: SwipePanEvent): Direction | null {
  'worklet';

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

  if (horizontal) {
    if (absTx < SWIPE_MIN_DISTANCE && absVx < SWIPE_VELOCITY_THRESHOLD) {
      return null;
    }
    return translationX > 0 ? 'RIGHT' : 'LEFT';
  }

  if (absTy < SWIPE_MIN_DISTANCE && absVy < SWIPE_VELOCITY_THRESHOLD) {
    return null;
  }
  return translationY > 0 ? 'DOWN' : 'UP';
}
