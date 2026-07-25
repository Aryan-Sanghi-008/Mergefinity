/**
 * @file ivory.theme.ts
 * @layer styles
 * @description Ivory IAP theme — soft pastel watercolor on warm off-white.
 */

import type { ThemeTokens } from '../theme.types';

/** Ivory theme tokens. */
export const ivoryTheme: ThemeTokens = {
  name: 'ivory',
  SURFACE: '#FEFEF4',
  BOARD_BG: '#E8E6DE',
  CELL_EMPTY: '#F0EEE6',
  TILE_BG: {
    0: '#F0EEE6',
    2: '#F5E6DC',
    4: '#F0DCC8',
    8: '#E8C4B0',
    16: '#D4B8C8',
    32: '#C0B8D4',
    64: '#A8C4D4',
    128: '#B8D4C0',
    256: '#D4D0A8',
    512: '#E0C898',
    1024: '#E8B888',
    2048: '#E8A070',
    4096: '#D888A0',
    8192: '#C090C0',
    16384: '#A0A8D0',
    32768: '#90C0C8',
    65536: '#B0D0B8',
    131072: '#D8D0B0',
  },
  TILE_TEXT: {
    0: 'transparent',
    2: '#5C5348',
    4: '#5C5348',
    8: '#4A4038',
    16: '#3E3848',
    32: '#383848',
    64: '#304048',
    128: '#304038',
    256: '#403828',
    512: '#403020',
    1024: '#402818',
    2048: '#3C2818',
    4096: '#3C2030',
    8192: '#382038',
    16384: '#282840',
    32768: '#203838',
    65536: '#283828',
    131072: '#383828',
  },
  TEXT_PRIMARY: '#5C5348',
  TEXT_SECONDARY: '#7A7064',
  TEXT_MUTED: '#9A9084',
  DIVIDER: '#DCD8CE',
  BUTTON_BG: '#C8B8A8',
  BUTTON_TEXT: '#3C342C',
  ACCENT: '#E8A070',
  OVERLAY: 'rgba(254,254,244,0.78)',
  SCORE_BG: '#E8E6DE',
  SCORE_TEXT: '#5C5348',
  elevation: {
    TILE_ELEVATION: 2,
    BOARD_ELEVATION: 4,
    shadowColor: '#5C5348',
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
};
