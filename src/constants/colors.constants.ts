/**
 * @file colors.constants.ts
 * @layer constants
 * @description Tile background and text colors keyed by CellValue.
 */

import type { CellValue } from '@/types';

export const TILE_COLORS: Record<CellValue, string> = {
  0: '#CCC0B3',
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
  4096: '#3C3A32',
  8192: '#3C3A32',
} as const;

export const TILE_TEXT_COLORS: Record<CellValue, string> = {
  0: 'transparent',
  2: '#776E65',
  4: '#776E65',
  8: '#F9F6F0',
  16: '#F9F6F0',
  32: '#F9F6F0',
  64: '#F9F6F0',
  128: '#F9F6F0',
  256: '#F9F6F0',
  512: '#F9F6F0',
  1024: '#F9F6F0',
  2048: '#F9F6F0',
  4096: '#F9F6F0',
  8192: '#F9F6F0',
} as const;
