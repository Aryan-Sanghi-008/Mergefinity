/**
 * @file typography.ts
 * @layer styles
 * @description Font families and type scale (P-04).
 */

import type { TextStyle } from 'react-native';

/** Font family tokens. */
export const FONT_TILE = 'SpaceGrotesk-Bold' as const;
/** Inter Regular for UI chrome. */
export const FONT_UI = 'Inter-Regular' as const;
/** Inter Medium. */
export const FONT_UI_MEDIUM = 'Inter-Medium' as const;
/** Inter SemiBold. */
export const FONT_UI_SEMIBOLD = 'Inter-SemiBold' as const;

/** Type sizes in sp/dp. */
export const TYPE_SCALE = {
  scoreLabel: 10,
  score: 22,
  caption: 12,
  body: 14,
  title: 20,
  tileFiveDigit: 20,
  tileFourDigit: 24,
  tileThreeDigit: 30,
  tileTwoDigit: 36,
} as const;

/** Shared text style presets. */
export const TYPOGRAPHY = {
  tileValue: {
    fontFamily: FONT_TILE,
    fontWeight: '700',
  } satisfies TextStyle,
  score: {
    fontFamily: FONT_UI_SEMIBOLD,
    fontSize: TYPE_SCALE.score,
    fontWeight: '600',
  } satisfies TextStyle,
  scoreLabel: {
    fontFamily: FONT_UI_MEDIUM,
    fontSize: TYPE_SCALE.scoreLabel,
    fontWeight: '500',
    letterSpacing: 1,
  } satisfies TextStyle,
  body: {
    fontFamily: FONT_UI,
    fontSize: TYPE_SCALE.body,
    fontWeight: '400',
  } satisfies TextStyle,
  title: {
    fontFamily: FONT_UI_SEMIBOLD,
    fontSize: TYPE_SCALE.title,
    fontWeight: '600',
  } satisfies TextStyle,
} as const;

/**
 * Derive tile font size from value magnitude.
 * @param value - Tile numeric value
 * @returns Font size in dp
 */
export function getTileFontSize(value: number): number {
  if (value < 100) return TYPE_SCALE.tileTwoDigit;
  if (value < 1000) return TYPE_SCALE.tileThreeDigit;
  if (value < 10000) return TYPE_SCALE.tileFourDigit;
  return TYPE_SCALE.tileFiveDigit;
}
