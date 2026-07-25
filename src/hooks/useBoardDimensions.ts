/**
 * @file useBoardDimensions.ts
 * @layer hooks
 * @description Derives square board / tile geometry from screen width (P-05 / P-06).
 */

import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

import { BOARD_SIZE } from '@/constants';
import { SPACING_TOKENS } from '@/styles';

/** Board layout metrics shared by CellBackground and GameBoard. */
export interface BoardDimensions {
  /** Outer board edge length (square). */
  boardSizePx: number;
  /** Single tile edge length. */
  tileSize: number;
  /** Gap between tiles. */
  gap: number;
  /** Inner board padding. */
  padding: number;
  /** Cells per axis. */
  cellCount: number;
}

/**
 * Computes board geometry: `boardSizePx = screenWidth - 2 × SCREEN_PADDING`.
 * @param cellCount - Cells per axis (default Classic 4)
 */
export function useBoardDimensions(cellCount: number = BOARD_SIZE): BoardDimensions {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    const padding = SPACING_TOKENS.BOARD_PADDING;
    const gap = SPACING_TOKENS.TILE_GAP;
    const boardSizePx = width - SPACING_TOKENS.SCREEN_PADDING * SPACING_TOKENS.LAYOUT_DOUBLE;
    const gapsTotal = gap * (cellCount - 1);
    const tileSize =
      (boardSizePx - padding * SPACING_TOKENS.LAYOUT_DOUBLE - gapsTotal) / cellCount;

    return {
      boardSizePx,
      tileSize,
      gap,
      padding,
      cellCount,
    };
  }, [width, cellCount]);
}
