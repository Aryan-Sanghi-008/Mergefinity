/**
 * @file classic.theme.ts
 * @layer styles
 * @description Classic free theme — warm cream → electric gold (P-00 tile map).
 */

import type { ThemeTokens } from '../theme.types';

/** Classic theme tokens. */
export const classicTheme: ThemeTokens = {
  name: 'classic',
  SURFACE: '#FAF8EF',
  BOARD_BG: '#BBADA0',
  CELL_EMPTY: '#CDC1B4',
  TILE_BG: {
    0: '#CDC1B4',
    2: '#EEE4DA',
    4: '#EDE0C8',
    8: '#F2B179',
    16: '#F59563',
    32: '#F67C5F',
    64: '#B84A28',
    128: '#EDCF72',
    256: '#EDCC61',
    512: '#EDC850',
    1024: '#EDC53F',
    2048: '#EDC22E',
    4096: '#F0B429',
    8192: '#F5A623',
    16384: '#FF9F1A',
    32768: '#FFB347',
    65536: '#FFE08A',
    131072: '#FFF6D6',
  },
  TILE_TEXT: {
    0: 'transparent',
    2: '#4A433C',
    4: '#4A433C',
    8: '#3C3A32',
    16: '#3C3A32',
    32: '#2A2820',
    64: '#F9F6F0',
    128: '#3C3A32',
    256: '#3C3A32',
    512: '#3C3A32',
    1024: '#3C3A32',
    2048: '#3C3A32',
    4096: '#3C3A32',
    8192: '#3C3A32',
    16384: '#3C3A32',
    32768: '#3C3A32',
    65536: '#3C3A32',
    131072: '#3C3A32',
  },
  TEXT_PRIMARY: '#776E65',
  TEXT_SECONDARY: '#8F7A66',
  TEXT_MUTED: '#9A9084',
  DIVIDER: '#D6CDC4',
  BUTTON_BG: '#8F7A66',
  BUTTON_TEXT: '#F9F6F0',
  ACCENT: '#EDC22E',
  OVERLAY: 'rgba(238,228,218,0.73)',
  SCORE_BG: '#BBADA0',
  SCORE_TEXT: '#F9F6F0',
  elevation: {
    TILE_ELEVATION: 2,
    BOARD_ELEVATION: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
};
