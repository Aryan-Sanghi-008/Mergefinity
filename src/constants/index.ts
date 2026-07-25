/**
 * @file index.ts
 * @layer constants
 * @description Public barrel for all constants — import from '@/constants' only.
 */

export {
  BOARD_PADDING,
  BOARD_SIZE,
  CELL_COUNT,
  MAX_UNDO_HISTORY,
  SPAWN_VALUES,
  SPAWN_WEIGHT_2,
  TILE_GAP,
  TILE_SIZE,
  WIN_VALUE,
} from './board.constants';

export { STRINGS } from './strings.constants';
export type { StringKey } from './strings.constants';

export { TILE_COLORS, TILE_TEXT_COLORS } from './colors.constants';

export {
  MERGE_DURATION_MS,
  MERGE_SCALE,
  SLIDE_DURATION_MS,
  SPAWN_DURATION_MS,
} from './animation.constants';

export {
  SWIPE_MIN_DISTANCE,
  SWIPE_VELOCITY_THRESHOLD,
} from './gesture.constants';

export { STORAGE_KEYS } from './storage.constants';
export type { StorageKey } from './storage.constants';

export { RADII, SPACING } from './layout.constants';

export { FONT_FAMILY, FONT_SIZE } from './typography.constants';
