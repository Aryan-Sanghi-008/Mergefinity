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
  MERGE_DURATION_MS,
  MERGE_SCALE,
  OVERLAY_DURATION_MS,
  SCORE_DELTA_DURATION_MS,
  SCORE_DELTA_TRAVEL_DP,
  SLIDE_DURATION_MS,
  SPAWN_DELAY_MS,
  SPAWN_DURATION_MS,
  SPAWN_INITIAL_SCALE,
  TOAST_DURATION_MS,
  TOAST_TRAVEL_DP,
} from './animation.constants';

export { SWIPE_MIN_DISTANCE, SWIPE_VELOCITY_THRESHOLD } from './gesture.constants';

export { STORAGE_KEYS } from './storage.constants';
export type { StorageKey } from './storage.constants';
