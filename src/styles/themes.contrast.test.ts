/**
 * @file themes.contrast.test.ts
 * @layer styles
 * @description WCAG AA checks for every tile text/background pair across themes.
 */

import type { CellValue, ThemeName } from '@/types';

import { meetsWcagAa } from './contrast';
import { THEMES } from './theme';

const CELL_VALUES: CellValue[] = [
  2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536,
  131072,
];

const THEME_NAMES = Object.keys(THEMES) as ThemeName[];

describe('theme tile contrast (WCAG AA)', () => {
  it.each(THEME_NAMES)('%s — every occupied tile meets 4.5:1', (name) => {
    const theme = THEMES[name];
    const failures: string[] = [];

    for (const value of CELL_VALUES) {
      const bg = theme.TILE_BG[value];
      const fg = theme.TILE_TEXT[value];
      if (!meetsWcagAa(fg, bg)) {
        failures.push(`${value}: ${fg} on ${bg}`);
      }
    }

    expect(failures).toEqual([]);
  });

  it('classic and midnight surface tokens differ (live swap is meaningful)', () => {
    expect(THEMES.classic.SURFACE).not.toBe(THEMES.midnight.SURFACE);
    expect(THEMES.classic.TILE_BG[2048]).not.toBe(THEMES.midnight.TILE_BG[2048]);
  });
});
