/**
 * @file colors.constants.ts
 * @layer constants
 * @description Classic theme tile colors (P-00 `TILE_COLOR_MAP.md`). Dark/Midnight live in P-04 themes.
 */

import type { CellValue } from '@/types';

/** Classic tile background hex keyed by `CellValue`. */
export const TILE_COLORS: Record<CellValue, string> = {
  0: '#CDC1B4',
  2: '#EEE4DA',
  4: '#EDE0C8',
  8: '#F2B179',
  16: '#F59563',
  32: '#F67C5F',
  64: '#F65E3B',
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
} as const;

/** Classic tile text hex keyed by `CellValue` (WCAG AA intent). */
export const TILE_TEXT_COLORS: Record<CellValue, string> = {
  0: 'transparent',
  2: '#776E65',
  4: '#776E65',
  8: '#F9F6F0',
  16: '#F9F6F0',
  32: '#F9F6F0',
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
} as const;
