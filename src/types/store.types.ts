/**
 * @file store.types.ts
 * @layer types
 * @description Zustand game store state and action contracts.
 */

import type { Board, Direction, GameSnapshot } from './game.types';

/** Finite game status machine. */
export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

/** Persisted and ephemeral game state fields. */
export interface GameState {
  board: Board;
  score: number;
  bestScore: number;
  status: GameStatus;
  history: GameSnapshot[];
}

/** Imperative store actions. */
export interface GameActions {
  move: (dir: Direction) => void;
  undo: () => void;
  restart: () => void;
  continueAfterWin: () => void;
}

/** Combined Zustand store shape. */
export type GameStore = GameState & GameActions;
