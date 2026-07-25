/**
 * @file theme.ts
 * @layer styles
 * @description Theme registry and lookup helpers.
 */

import type { CellValue, ThemeName } from '@/types';

import { RADII, SPACING, SPACING_TOKENS } from './spacing';
import type { ThemeTokens } from './theme.types';
import { classicTheme } from './themes/classic.theme';
import { darkTheme } from './themes/dark.theme';
import { ivoryTheme } from './themes/ivory.theme';
import { midnightTheme } from './themes/midnight.theme';
import { obsidianTheme } from './themes/obsidian.theme';

/** Preview tile values for the P-04 theme lab screen. */
export const THEME_LAB_PREVIEW_VALUES: readonly CellValue[] = [
  2, 8, 2048, 131072,
];

/** All themes keyed by `ThemeName`. */
export const THEMES: Record<ThemeName, ThemeTokens> = {
  classic: classicTheme,
  dark: darkTheme,
  midnight: midnightTheme,
  obsidian: obsidianTheme,
  ivory: ivoryTheme,
};

/** Default theme on first launch. */
export const DEFAULT_THEME_NAME: ThemeName = 'classic';

/**
 * Returns the token set for a theme name.
 * @param name - Theme identifier
 */
export function getTheme(name: ThemeName): ThemeTokens {
  return THEMES[name];
}

/**
 * Legacy flat theme object for gradual migration (Classic defaults + spacing).
 * Prefer `useTheme().theme` in components.
 */
export const THEME = {
  colors: {
    background: classicTheme.SURFACE,
    boardBg: classicTheme.BOARD_BG,
    cellEmpty: classicTheme.CELL_EMPTY,
    text: classicTheme.TEXT_PRIMARY,
    textMuted: classicTheme.TEXT_MUTED,
    textLight: classicTheme.BUTTON_TEXT,
    score: classicTheme.SCORE_TEXT,
    primary: classicTheme.BUTTON_BG,
    accent: classicTheme.ACCENT,
    overlay: classicTheme.OVERLAY,
  },
  radii: RADII,
  spacing: SPACING,
  spacingTokens: SPACING_TOKENS,
  shadows: {
    tile: {
      elevation: classicTheme.elevation.TILE_ELEVATION,
      shadowColor: classicTheme.elevation.shadowColor,
      shadowOffset: classicTheme.elevation.shadowOffset,
      shadowOpacity: classicTheme.elevation.shadowOpacity,
      shadowRadius: classicTheme.elevation.shadowRadius,
    },
  },
} as const;

export type { ThemeTokens } from './theme.types';
export type Theme = typeof THEME;
