/**
 * @file theme.ts
 * @layer styles
 * @description Global visual design tokens for Mergefinity.
 */

import type { TextStyle, ViewStyle } from 'react-native';

import { RADII, SPACING } from '@/constants';

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
    tile: {
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
    } satisfies ViewStyle,
  },
} as const;

export type Theme = typeof THEME;

export const TYPOGRAPHY = {
  tileValue: {
    fontFamily: 'ClearSans-Bold',
    fontWeight: '700',
  } satisfies TextStyle,
  score: {
    fontFamily: 'ClearSans-Bold',
    fontSize: 22,
    fontWeight: '700',
  } satisfies TextStyle,
  scoreLabel: {
    fontFamily: 'ClearSans-Bold',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  } satisfies TextStyle,
} as const;

/**
 * Derive tile font size from value magnitude.
 * @param value - Tile numeric value
 * @returns Font size in dp
 */
export function getTileFontSize(value: number): number {
  if (value < 100) return 36;
  if (value < 1000) return 30;
  return 24;
}
