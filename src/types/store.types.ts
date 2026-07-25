/**
 * @file store.types.ts
 * @layer types
 * @description Zustand game store state and action contracts.
 */

import type { Board, Direction, GameMode, GameSnapshot } from './game.types';

/**
 * Finite game status machine.
 * `animating` blocks new input until slide/merge/spawn completes.
 */
export type GameStatus = 'idle' | 'playing' | 'won' | 'lost' | 'animating';

/** Persisted and ephemeral game state fields. */
export interface GameState {
  /** Current board. */
  board: Board;
  /** Current score. */
  score: number;
  /** Best score for the active mode (persisted). */
  bestScore: number;
  /** Lifecycle status. */
  status: GameStatus;
  /** Undo stack (newest last). */
  history: GameSnapshot[];
  /** Active play mode. */
  mode: GameMode;
  /** Undos remaining this game (mode / IAP dependent). */
  undosRemaining: number;
}

/** Imperative store actions. */
export interface GameActions {
  /** Resolve a swipe in `dir`. */
  move: (dir: Direction) => void;
  /** Restore the previous snapshot when undos remain. */
  undo: () => void;
  /** Start a fresh game in the current mode. */
  restart: () => void;
  /** Dismiss win overlay and continue past 2048. */
  continueAfterWin: () => void;
  /** Switch mode (may soft-restart). */
  setMode: (mode: GameMode) => void;
}

/** Combined Zustand store shape. */
export type GameStore = GameState & GameActions;
