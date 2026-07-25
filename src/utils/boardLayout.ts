/**
 * @file boardLayout.ts
 * @layer utils
 * @description Pure board tile offset math (P-06 gap-inset formula).
 */

/** Absolute position of a cell within the board square. */
export interface CellOffset {
  /** Distance from board left edge. */
  left: number;
  /** Distance from board top edge. */
  top: number;
}

/**
 * Computes absolute tile position from the P-06 formula:
 * `left = (col × (tileSize + gap)) + gap`;
 * `top = (row × (tileSize + gap)) + gap`.
 *
 * @param index - Flat row-major cell index
 * @param cellCount - Cells per axis
 * @param tileSize - Tile edge length
 * @param gap - Gap between tiles (also outer inset)
 */
export function getCellOffset(
  index: number,
  cellCount: number,
  tileSize: number,
  gap: number,
): CellOffset {
  const row = Math.floor(index / cellCount);
  const col = index % cellCount;
  return {
    left: col * (tileSize + gap) + gap,
    top: row * (tileSize + gap) + gap,
  };
}

/**
 * Precomputes offsets for every cell on the board.
 *
 * @param cellCount - Cells per axis
 * @param tileSize - Tile edge length
 * @param gap - Gap between tiles (also outer inset)
 */
export function getAllCellOffsets(
  cellCount: number,
  tileSize: number,
  gap: number,
): readonly CellOffset[] {
  const total = cellCount * cellCount;
  return Array.from({ length: total }, (_, index) =>
    getCellOffset(index, cellCount, tileSize, gap),
  );
}

/**
 * Tile edge length so `cellCount` tiles + `(cellCount + 1)` gaps fill `boardSizePx`.
 *
 * @param boardSizePx - Outer board edge length
 * @param cellCount - Cells per axis
 * @param gap - Gap / outer inset
 */
export function getTileSize(boardSizePx: number, cellCount: number, gap: number): number {
  const gapSlots = cellCount + 1;
  return (boardSizePx - gap * gapSlots) / cellCount;
}
