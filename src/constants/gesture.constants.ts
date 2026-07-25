/**
 * @file gesture.constants.ts
 * @layer constants
 * @description Pan gesture distance and velocity thresholds.
 */

/** Minimum pan distance in dp to count as a swipe. */
export const SWIPE_MIN_DISTANCE = 20;

/** Minimum pan velocity to count as a swipe. */
export const SWIPE_VELOCITY_THRESHOLD = 200;

/**
 * When velocity magnitude exceeds this, velocity wins over translation
 * for ambiguous diagonal swipes (P-08).
 */
export const SWIPE_VELOCITY_DIAGONAL = 500;
