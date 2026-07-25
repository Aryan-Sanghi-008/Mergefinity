/**
 * @file dark.theme.ts
 * @layer styles
 * @description Dark free theme — cooled desaturated night palette (P-00 map).
 */

import type { ThemeTokens } from '../theme.types';

/** Dark theme tokens. */
export const darkTheme: ThemeTokens = {
  name: 'dark',
  SURFACE: '#111118',
  BOARD_BG: '#1C1C24',
  CELL_EMPTY: '#2A2A32',
  TILE_BG: {
    0: '#2A2A32',
    2: '#3A3A44',
    4: '#454550',
    8: '#4A5568',
    16: '#556273',
    32: '#5F6E82',
    64: '#7A8A9F',
    128: '#7E9298',
    256: '#738A8F',
    512: '#7E9690',
    1024: '#8AA48A',
    2048: '#C4B56A',
    4096: '#A8B8C4',
    8192: '#B8C8D4',
    16384: '#C8D6E0',
    32768: '#D6E2EA',
    65536: '#E4EEF4',
    131072: '#F0F6FA',
  },
  TILE_TEXT: {
    0: 'transparent',
    2: '#E8E8EC',
    4: '#E8E8EC',
    8: '#F0F2F5',
    16: '#F0F2F5',
    32: '#F0F2F5',
    64: '#0E1014',
    128: '#0E1014',
    256: '#0E1014',
    512: '#0E1014',
    1024: '#0E1014',
    2048: '#0E1014',
    4096: '#0E1014',
    8192: '#0E1014',
    16384: '#0E1014',
    32768: '#0E1014',
    65536: '#0E1014',
    131072: '#0E1014',
  },
  TEXT_PRIMARY: '#E8E8EC',
  TEXT_SECONDARY: '#B0B0BA',
  TEXT_MUTED: '#7A7A88',
  DIVIDER: '#2A2A36',
  BUTTON_BG: '#3A3A48',
  BUTTON_TEXT: '#F0F2F5',
  ACCENT: '#C4B56A',
  OVERLAY: 'rgba(8,8,12,0.78)',
  SCORE_BG: '#2A2A36',
  SCORE_TEXT: '#F0F2F5',
  elevation: {
    TILE_ELEVATION: 2,
    BOARD_ELEVATION: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
};
