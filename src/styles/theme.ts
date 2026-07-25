/**
 * @file theme.ts
 * @layer styles
 * @description Global visual design tokens for Mergefinity.
 */

import type { TextStyle, ViewStyle } from 'react-native';

import { FONT_FAMILY, FONT_SIZE, RADII, SPACING } from '@/constants';

export const THEME = {
  colors: {
    background: '#FAF8EF',
    boardBg: '#BBADA0',
    cellEmpty: '#CDC1B4',
    text: '#776E65',
    textMuted: '#9A9084',
    textLight: '#F9F6F0',
    score: '#F9F6F0',
    primary: '#8F7A66',
    accent: '#F65E3B',
    overlay: 'rgba(238,228,218,0.73)',
  },
  radii: RADII,
  spacing: SPACING,
  shadows: {
    /** Tiles intentionally flat (P-00); reserved for board chrome if needed later. */
    tile: {
      elevation: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
    } satisfies ViewStyle,
  },
} as const;

export type Theme = typeof THEME;

export const TYPOGRAPHY = {
  tileValue: {
    fontFamily: FONT_FAMILY.tile,
    fontWeight: '700',
  } satisfies TextStyle,
  score: {
    fontFamily: FONT_FAMILY.uiSemiBold,
    fontSize: FONT_SIZE.score,
    fontWeight: '600',
  } satisfies TextStyle,
  scoreLabel: {
    fontFamily: FONT_FAMILY.uiMedium,
    fontSize: FONT_SIZE.scoreLabel,
    fontWeight: '500',
    letterSpacing: 1,
  } satisfies TextStyle,
} as const;

/**
 * Derive tile font size from value magnitude (P-00 / P-04 digit scale).
 * @param value - Tile numeric value
 * @returns Font size in dp
 */
export function getTileFontSize(value: number): number {
  if (value < 100) return FONT_SIZE.tileTwoDigit;
  if (value < 1000) return FONT_SIZE.tileThreeDigit;
  if (value < 10000) return FONT_SIZE.tileFourDigit;
  return FONT_SIZE.tileFiveDigit;
}
