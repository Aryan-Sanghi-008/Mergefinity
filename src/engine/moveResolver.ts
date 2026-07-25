/**
 * @file moveResolver.ts
 * @layer engine
 * @description Resolves a swipe via rotation + left-shift. Pure TypeScript only.
 */

import { BOARD_SIZE, DIR_ROTATIONS, QUARTER_TURNS } from '@/constants';
import type { Board, CellValue, Direction, MoveResult, TileMove } from '@/types';

import { rotateBoard, rotateIndex } from './boardRotator';
import { shiftRowLeft } from './rowShifter';

/**
 * Resolves a swipe in the given direction.
 * @param board - Current board (read-only)
 * @param dir - Player's swipe direction
 * @param boardSize - Cells per axis (default Classic 4)
 */
export function resolveMove(
  board: Readonly<Board>,
  dir: Direction,
  boardSize: number = BOARD_SIZE,
): MoveResult {
  const rotations = DIR_ROTATIONS[dir];
  const pre = rotations[0];
  const post = rotations[1];
  const inversePre = normalizeInverse(pre);

  const rotated = rotateBoard(board, pre, boardSize);

  let delta = 0;
  const shifted: CellValue[] = [];
  const tileMoves: TileMove[] = [];

  for (let row = 0; row < boardSize; row += 1) {
    const rowStart = row * boardSize;
    const rowValues = rotated.slice(rowStart, rowStart + boardSize) as CellValue[];
    const { row: nextRow, delta: rowDelta, moves } = shiftRowLeft(rowValues);
    delta += rowDelta;
    shifted.push(...nextRow);

    for (const move of moves) {
      if (move.fromCol === move.toCol && !move.merged) {
        continue;
      }

      const fromRotated = rowStart + move.fromCol;
      const toRotated = rowStart + move.toCol;

      tileMoves.push({
        from: rotateIndex(fromRotated, inversePre, boardSize),
        to: rotateIndex(toRotated, post, boardSize),
        value: move.value,
        merged: move.merged,
      });
    }
  }

  const result = rotateBoard(shifted as Board, post, boardSize);
  const boardChanged = result.some((value, index) => value !== board[index]);

  return {
    board: result,
    scoreDelta: delta,
    tileMoves: boardChanged ? tileMoves : [],
    boardChanged,
  };
}

/**
 * Inverse of `pre` clockwise rotations (for mapping rotated indices back).
 */
function normalizeInverse(pre: number): number {
  return (QUARTER_TURNS - (pre % QUARTER_TURNS)) % QUARTER_TURNS;
}

/** Re-export rotator for callers that imported from moveResolver historically. */
export { rotateBoard } from './boardRotator';
