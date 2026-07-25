/**
 * @file index.ts
 * @layer styles
 * @description Public barrel for design tokens and themes.
 */

export {
  MERGE_POP_ANIMATION,
  OVERLAY_ANIMATION,
  SCORE_DELTA_ANIMATION,
  SLIDE_ANIMATION,
  SPAWN_ANIMATION,
} from './animations';

export { RADII, SPACING, SPACING_TOKENS } from './spacing';

export {
  FONT_TILE,
  FONT_UI,
  FONT_UI_MEDIUM,
  FONT_UI_SEMIBOLD,
  getTileFontSize,
  TYPE_SCALE,
  TYPOGRAPHY,
} from './typography';

export {
  DEFAULT_THEME_NAME,
  getTheme,
  THEME,
  THEME_LAB_PREVIEW_VALUES,
  THEMES,
} from './theme';

export type { Theme, ThemeTokens } from './theme';

export { contrastRatio, meetsWcagAa, parseHexColor, relativeLuminance } from './contrast';

export { classicTheme } from './themes/classic.theme';
export { darkTheme } from './themes/dark.theme';
export { ivoryTheme } from './themes/ivory.theme';
export { midnightTheme } from './themes/midnight.theme';
export { obsidianTheme } from './themes/obsidian.theme';
