/**
 * @file useBoardDimensions.ts
 * @layer hooks
 * @description Derives square board / tile geometry from screen width (P-05 / P-06).
 */

import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

import { BOARD_SIZE } from '@/constants';
import { SPACING_TOKENS } from '@/styles';
import { getAllCellOffsets, getTileSize, type CellOffset } from '@/utils/boardLayout';

/** Board layout metrics shared by CellBackground and GameBoard. */
export interface BoardDimensions {
  /** Outer board edge length (square). */
  boardSizePx: number;
  /** Single tile edge length. */
  tileSize: number;
  /** Gap between tiles (also outer inset per P-06). */
  gap: number;
  /** Inner board inset — equals `gap` under the P-06 formula. */
  padding: number;
  /** Cells per axis. */
  cellCount: number;
  /** Absolute left/top per flat index — tilePositions equivalent (P-17). */
  cellOffsets: readonly CellOffset[];
}

/**
 * Computes board geometry: `boardSizePx = screenWidth - 2 × SCREEN_PADDING`.
 * Tile positions use `left/top = (col/row × (tileSize + gap)) + gap`.
 * @param cellCount - Cells per axis (default Classic 4)
 */
export function useBoardDimensions(cellCount: number = BOARD_SIZE): BoardDimensions {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    const gap = SPACING_TOKENS.TILE_GAP;
    const boardSizePx = width - SPACING_TOKENS.SCREEN_PADDING * SPACING_TOKENS.LAYOUT_DOUBLE;
    const tileSize = getTileSize(boardSizePx, cellCount, gap);
    const cellOffsets = getAllCellOffsets(cellCount, tileSize, gap);

    return {
      boardSizePx,
      tileSize,
      gap,
      padding: gap,
      cellCount,
      cellOffsets,
    };
  }, [width, cellCount]);
}
