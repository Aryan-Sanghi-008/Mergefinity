/**
 * @file index.ts
 * @layer types
 * @description Public barrel for all domain types — import from '@/types' only.
 */

export type {
  Board,
  CellValue,
  Direction,
  GameSnapshot,
  MoveResult,
  TileMove,
} from './game.types';

export type { ShiftRowResult } from './board.types';

export type {
  GameActions,
  GameState,
  GameStatus,
  GameStore,
} from './store.types';
