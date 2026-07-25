/**
 * @file obsidian.theme.ts
 * @layer styles
 * @description Obsidian IAP theme — graphite slate → electric blue at 2048.
 */

import type { ThemeTokens } from '../theme.types';

/** Obsidian theme tokens. */
export const obsidianTheme: ThemeTokens = {
  name: 'obsidian',
  SURFACE: '#0A0A0A',
  BOARD_BG: '#1A1A1A',
  CELL_EMPTY: '#242424',
  TILE_BG: {
    0: '#242424',
    2: '#2E2E32',
    4: '#38383E',
    8: '#42424C',
    16: '#4C4C5A',
    32: '#565668',
    64: '#606076',
    128: '#3A4A6A',
    256: '#2A5A8A',
    512: '#1A6AAA',
    1024: '#0A7ACA',
    2048: '#0052B8',
    4096: '#2090FF',
    8192: '#40A0FF',
    16384: '#60B0FF',
    32768: '#80C0FF',
    65536: '#A0D0FF',
    131072: '#C0E0FF',
  },
  TILE_TEXT: {
    0: 'transparent',
    2: '#E8E8EC',
    4: '#E8E8EC',
    8: '#F0F0F4',
    16: '#F0F0F4',
    32: '#F0F0F4',
    64: '#F0F0F4',
    128: '#F5F8FF',
    256: '#F5F8FF',
    512: '#FFFFFF',
    1024: '#FFFFFF',
    2048: '#FFFFFF',
    4096: '#061018',
    8192: '#061018',
    16384: '#061018',
    32768: '#061018',
    65536: '#061018',
    131072: '#061018',
  },
  TEXT_PRIMARY: '#E8E8EC',
  TEXT_SECONDARY: '#A8A8B0',
  TEXT_MUTED: '#6A6A72',
  DIVIDER: '#2A2A2A',
  BUTTON_BG: '#2E2E32',
  BUTTON_TEXT: '#F0F0F4',
  ACCENT: '#0052B8',
  OVERLAY: 'rgba(0,0,0,0.82)',
  SCORE_BG: '#242424',
  SCORE_TEXT: '#F0F0F4',
  elevation: {
    TILE_ELEVATION: 2,
    BOARD_ELEVATION: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
};
