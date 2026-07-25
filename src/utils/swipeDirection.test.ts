/**
 * @file swipeDirection.test.ts
 * @layer utils
 * @description Unit tests for swipe direction / tap rejection.
 */

import {
  SWIPE_MIN_DISTANCE,
  SWIPE_VELOCITY_DIAGONAL,
  SWIPE_VELOCITY_THRESHOLD,
} from '@/constants';

import { resolveSwipeDirection } from './swipeDirection';

describe('resolveSwipeDirection', () => {
  it('rejects a tap (below distance and velocity)', () => {
    expect(
      resolveSwipeDirection({
        translationX: 0,
        translationY: 0,
        velocityX: 0,
        velocityY: 0,
      }),
    ).toBeNull();
    expect(
      resolveSwipeDirection({
        translationX: SWIPE_MIN_DISTANCE - 1,
        translationY: 0,
        velocityX: SWIPE_VELOCITY_THRESHOLD - 1,
        velocityY: 0,
      }),
    ).toBeNull();
  });

  it('resolves four directions from translation', () => {
    expect(
      resolveSwipeDirection({
        translationX: SWIPE_MIN_DISTANCE,
        translationY: 0,
        velocityX: 0,
        velocityY: 0,
      }),
    ).toBe('RIGHT');
    expect(
      resolveSwipeDirection({
        translationX: -SWIPE_MIN_DISTANCE,
        translationY: 0,
        velocityX: 0,
        velocityY: 0,
      }),
    ).toBe('LEFT');
    expect(
      resolveSwipeDirection({
        translationX: 0,
        translationY: SWIPE_MIN_DISTANCE,
        velocityX: 0,
        velocityY: 0,
      }),
    ).toBe('DOWN');
    expect(
      resolveSwipeDirection({
        translationX: 0,
        translationY: -SWIPE_MIN_DISTANCE,
        velocityX: 0,
        velocityY: 0,
      }),
    ).toBe('UP');
  });

  it('prefers velocity axis when diagonal speed is high', () => {
    const speed = SWIPE_VELOCITY_DIAGONAL + 1;
    // Strong vertical velocity wins the axis; sign still follows translationY
    expect(
      resolveSwipeDirection({
        translationX: SWIPE_MIN_DISTANCE,
        translationY: -SWIPE_MIN_DISTANCE,
        velocityX: 0,
        velocityY: -speed,
      }),
    ).toBe('UP');
  });
});
