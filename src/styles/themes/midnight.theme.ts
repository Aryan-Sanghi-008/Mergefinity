/**
 * @file midnight.theme.ts
 * @layer styles
 * @description Midnight free theme — indigo steel → electric blue (P-00 map).
 */

import type { ThemeTokens } from '../theme.types';

/** Midnight theme tokens. */
export const midnightTheme: ThemeTokens = {
  name: 'midnight',
  SURFACE: '#0A0F2E',
  BOARD_BG: '#141B45',
  CELL_EMPTY: '#1A2250',
  TILE_BG: {
    0: '#1A2250',
    2: '#2A3470',
    4: '#343E80',
    8: '#3E4A98',
    16: '#4856B0',
    32: '#5262C4',
    64: '#6B7AE0',
    128: '#4A7AE0',
    256: '#3D8AF0',
    512: '#2E9AFF',
    1024: '#1AA8FF',
    2048: '#00B4FF',
    4096: '#33C4FF',
    8192: '#66D4FF',
    16384: '#99E2FF',
    32768: '#B8ECFF',
    65536: '#D6F4FF',
    131072: '#EEFAFF',
  },
  TILE_TEXT: {
    0: 'transparent',
    2: '#DCE4FF',
    4: '#DCE4FF',
    8: '#EEF2FF',
    16: '#EEF2FF',
    32: '#EEF2FF',
    64: '#061018',
    128: '#061018',
    256: '#061018',
    512: '#061018',
    1024: '#061018',
    2048: '#061018',
    4096: '#061018',
    8192: '#061018',
    16384: '#061018',
    32768: '#061018',
    65536: '#061018',
    131072: '#061018',
  },
  TEXT_PRIMARY: '#DCE4FF',
  TEXT_SECONDARY: '#9AA8D8',
  TEXT_MUTED: '#6A78A8',
  DIVIDER: '#1E2860',
  BUTTON_BG: '#2A3470',
  BUTTON_TEXT: '#EEF2FF',
  ACCENT: '#00B4FF',
  OVERLAY: 'rgba(6,10,30,0.8)',
  SCORE_BG: '#1A2250',
  SCORE_TEXT: '#EEF2FF',
  elevation: {
    TILE_ELEVATION: 2,
    BOARD_ELEVATION: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.45,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
};
