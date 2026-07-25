/**
 * @file animation.constants.ts
 * @layer constants
 * @description Reanimated timing and scale values.
 */

/** Tile slide duration in ms (sub-200ms motion language). */
export const SLIDE_DURATION_MS = 120;

/** Merge pop phase duration budget in ms. */
export const MERGE_DURATION_MS = 160;

/** New tile spawn animation duration in ms. */
export const SPAWN_DURATION_MS = 140;

/** Peak scale during merge pop. */
export const MERGE_SCALE = 1.15;

/** Initial scale for spawn-in tiles. */
export const SPAWN_INITIAL_SCALE = 0.0;

/** Optional stagger between spawn animations in ms. */
export const SPAWN_DELAY_MS = 40;

/** Score delta float duration in ms. */
export const SCORE_DELTA_DURATION_MS = 600;

/** Score delta float travel distance in dp. */
export const SCORE_DELTA_TRAVEL_DP = 40;

/** Overlay fade/slide duration in ms. */
export const OVERLAY_DURATION_MS = 300;

/** Merge pop scale-up segment duration in ms (before spring settle). */
export const MERGE_POP_UP_DURATION_MS = 60;

/** Score counter roll duration in ms. */
export const SCORE_ROLL_DURATION_MS = 300;

/** Board edge pulse — flash in duration in ms. */
export const EDGE_PULSE_IN_MS = 80;

/** Board edge pulse — fade out duration in ms. */
export const EDGE_PULSE_OUT_MS = 220;

/** Board edge pulse border width in dp. */
export const EDGE_PULSE_BORDER_WIDTH = 3;

/** Win overlay card brief scale overshoot. */
export const WIN_CARD_OVERSHOOT_SCALE = 1.04;

/** Reduced-motion: collapse decorative durations to this floor (ms). */
export const REDUCED_MOTION_DURATION_MS = 0;

/** Achievement toast auto-dismiss duration in ms. */
export const TOAST_DURATION_MS = 3000;

/** Toast slide travel distance in dp. */
export const TOAST_TRAVEL_DP = 24;
