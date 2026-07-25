/**
 * @file game.types.ts
 * @layer types
 * @description Core game domain types for Mergefinity board and moves.
 */

/**
 * A cell value: `0` means empty; otherwise a power of two through 131072.
 */
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
  | 8192
  | 16384
  | 32768
  | 65536
  | 131072;

/** The board as a flat row-major array (`CELL_COUNT` cells). */
export type Board = CellValue[];

/** Valid swipe directions. */
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

/** Play mode identifiers. */
export type GameMode = 'classic' | 'endless' | 'challenge' | 'time-attack';

/** Visual theme identifiers (free + IAP). */
export type ThemeName = 'classic' | 'dark' | 'midnight' | 'obsidian' | 'ivory';

/** Describes a single tile move for animation coordination. */
export interface TileMove {
  /** Flat source index. */
  from: number;
  /** Flat destination index. */
  to: number;
  /** Tile value after the move (post-merge if merged). */
  value: CellValue;
  /** Whether this move produced a merge at `to`. */
  merged: boolean;
}

/** Snapshot of one game moment (undo history). */
export interface GameSnapshot {
  /** Board at this moment. */
  board: Board;
  /** Score at this moment. */
  score: number;
  /** Move count at this moment. */
  moves: number;
  /** Epoch ms when the snapshot was taken. */
  timestamp: number;
}

/** Outcome after resolving a swipe. */
export interface MoveResult {
  /** Board after the move. */
  board: Board;
  /** Points added this move. */
  scoreDelta: number;
  /** Per-tile animation descriptors. */
  tileMoves: TileMove[];
  /** False when the swipe changed nothing. */
  boardChanged: boolean;
}
