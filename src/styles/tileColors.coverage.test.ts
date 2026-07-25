/**
 * @file tileColors.coverage.test.ts
 * @layer styles
 * @description Every CellValue has TILE_BG / TILE_TEXT (P-18 TILE_COLORS equivalent).
 */

import type { CellValue, ThemeName } from '@/types';

import { THEMES } from './theme';

const CELL_VALUES: CellValue[] = [
  0, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768,
  65536, 131072,
];

const THEME_NAMES = Object.keys(THEMES) as ThemeName[];

describe('TILE_BG / TILE_TEXT cover CellValue', () => {
  it.each(THEME_NAMES)('%s defines colors for every CellValue', (name) => {
    const theme = THEMES[name];
    for (const value of CELL_VALUES) {
      expect(theme.TILE_BG[value]).toEqual(expect.any(String));
      expect(theme.TILE_TEXT[value]).toEqual(expect.any(String));
      expect(theme.TILE_BG[value].length).toBeGreaterThan(0);
      expect(theme.TILE_TEXT[value].length).toBeGreaterThan(0);
    }
  });
});
