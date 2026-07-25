/**
 * @file useDemoGame.ts
 * @layer hooks
 * @description Static demo board until P-09 Zustand store lands.
 */

import { useCallback, useState } from 'react';

import { createEmptyBoard, spawnTile } from '@/engine';
import type { Board } from '@/types';

/** Demo game surface returned to the game screen. */
export interface DemoGameState {
  /** Current board cells. */
  board: Board;
  /** Current score (static demo stays at 0 until moves exist). */
  score: number;
  /** Best score (static demo stays at 0 until persist exists). */
  bestScore: number;
  /** Remaining undos (none until store history). */
  undoRemaining: number;
  /** Undo is disabled in the static demo. */
  undoDisabled: boolean;
  /** Reseed a fresh two-tile board. */
  onNewGame: () => void;
  /** No-op until undo history exists. */
  onUndo: () => void;
}

/** Deterministic RNG for a predictable static preview. */
function demoRng(): number {
  return 0;
}

/**
 * Seeds a Classic-style opening board (two spawned tiles).
 */
function createDemoBoard(): Board {
  let board = createEmptyBoard();
  board = spawnTile(board, demoRng);
  board = spawnTile(board, demoRng);
  return board;
}

/**
 * Local demo game state for P-06 static board UI (replaced by useGameEngine in P-09+).
 */
export function useDemoGame(): DemoGameState {
  const [board, setBoard] = useState<Board>(createDemoBoard);
  const [score] = useState(0);
  const [bestScore] = useState(0);

  const onNewGame = useCallback(() => {
    setBoard(createDemoBoard());
  }, []);

  const onUndo = useCallback(() => {
    // Undo requires snapshot history — wired in P-09.
  }, []);

  return {
    board,
    score,
    bestScore,
    undoRemaining: 0,
    undoDisabled: true,
    onNewGame,
    onUndo,
  };
}
