/**
 * @file themeResolve.ts
 * @layer utils
 * @description Effective theme resolution and premium theme helpers (P-13).
 */

import type { ThemeName } from '@/types';

/** Premium IAP themes. */
export const PREMIUM_THEMES: readonly ThemeName[] = ['obsidian', 'ivory'];

/** Free themes. */
export const FREE_THEMES: readonly ThemeName[] = ['classic', 'dark', 'midnight'];

/** Ordered picker list: free first, then premium. */
export const THEME_PICKER_ORDER: readonly ThemeName[] = [
  ...FREE_THEMES,
  ...PREMIUM_THEMES,
];

/** Locked premium preview duration (ms). */
export const THEME_PREVIEW_MS = 5000;

export type ColorSchemeName = 'light' | 'dark' | null;

/**
 * True when the theme requires the premium bundle.
 */
export function isPremiumTheme(name: ThemeName): boolean {
  return PREMIUM_THEMES.includes(name);
}

/**
 * Resolves the theme tokens to apply.
 * System dark only overrides when followSystemDark is on and saved theme is Classic.
 */
export function resolveEffectiveTheme(
  savedTheme: ThemeName,
  followSystemDark: boolean,
  colorScheme: ColorSchemeName,
): ThemeName {
  if (followSystemDark && savedTheme === 'classic') {
    return colorScheme === 'dark' ? 'dark' : 'classic';
  }
  return savedTheme;
}
