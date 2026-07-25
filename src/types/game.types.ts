/**
 * @file game.types.ts
 * @layer types
 * @description Core game domain types for Mergefinity board and moves.
 */

/** A cell value: 0 means empty, power-of-two means occupied. */
export type CellValue =
  | 0
  | 2
  | 4
  | 8
  | 16
  | 32
  | 64
  | 128
  | 256
  | 512
  | 1024
  | 2048
  | 4096
  | 8192;

/** The 4x4 board represented as a flat array, row-major. */
export type Board = CellValue[];

/** Valid swipe directions. */
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

/** Describes a single tile move for animation purposes. */
export interface TileMove {
  from: number;
  to: number;
  value: CellValue;
  merged: boolean;
}

/** Full snapshot of one game moment (used for undo history). */
export interface GameSnapshot {
  board: Board;
  score: number;
  moves: number;
  timestamp: number;
}

/** Outcome after resolving a move. */
export interface MoveResult {
  board: Board;
  scoreDelta: number;
  tileMoves: TileMove[];
  boardChanged: boolean;
}
