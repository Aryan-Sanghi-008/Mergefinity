/**
 * @file index.ts
 * @layer constants
 * @description Public barrel for domain constants — visual tokens live in `@/styles`.
 */

export {
  BOARD_SIZE,
  CELL_COUNT,
  DIR_ROTATIONS,
  MAX_UNDO_HISTORY,
  QUARTER_TURNS,
  SPAWN_TILE_2,
  SPAWN_TILE_4,
  SPAWN_VALUES,
  SPAWN_WEIGHT_2,
  TILE_MERGE_FACTOR,
  WIN_VALUE,
} from './board.constants';

export { STRINGS } from './strings.constants';
export type { StringKey } from './strings.constants';

export {
  GAME_MODES,
  MODE_CONFIG,
  MS_PER_SECOND,
  SECONDS_PER_MINUTE,
  TIMER_SECONDS_PAD,
  UNDO_HISTORY_CAP,
  UNDO_UNLIMITED,
} from './modes.constants';
export type { ModeConfig } from './modes.constants';

export {
  EDGE_PULSE_BORDER_WIDTH,
  EDGE_PULSE_IN_MS,
  EDGE_PULSE_OUT_MS,
  MERGE_DURATION_MS,
  MERGE_POP_UP_DURATION_MS,
  MERGE_SCALE,
  OVERLAY_DURATION_MS,
  REDUCED_MOTION_DURATION_MS,
  SCORE_DELTA_DURATION_MS,
  SCORE_DELTA_TRAVEL_DP,
  SCORE_ROLL_DURATION_MS,
  SLIDE_DURATION_MS,
  SPAWN_DELAY_MS,
  SPAWN_DURATION_MS,
  SPAWN_INITIAL_SCALE,
  TOAST_DURATION_MS,
  TOAST_TRAVEL_DP,
  WIN_CARD_OVERSHOOT_SCALE,
} from './animation.constants';

export {
  SWIPE_MIN_DISTANCE,
  SWIPE_VELOCITY_DIAGONAL,
  SWIPE_VELOCITY_THRESHOLD,
} from './gesture.constants';

export { STORAGE_KEYS } from './storage.constants';
export type { StorageKey } from './storage.constants';

export { ACHIEVEMENT_IDS, MAX_SESSION_HISTORY } from './achievement.constants';
