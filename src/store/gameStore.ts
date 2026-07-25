/**
 * @file gameStore.ts
 * @layer store
 * @description Authoritative game session store with selective persistence (P-09).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { MAX_UNDO_HISTORY, STORAGE_KEYS } from '@/constants';
import { isLost, isWon } from '@/engine';
import type { GameSnapshot, GameStore } from '@/types';
import { createFreshBoard } from '@/utils/createFreshBoard';

import { analytics } from './middleware/analytics.middleware';

/** Fields restored after app kill (DoD — exact board resume). */
export type GamePersistedSlice = Pick<
  GameStore,
  | 'board'
  | 'score'
  | 'bestScore'
  | 'status'
  | 'history'
  | 'mode'
  | 'undosRemaining'
  | 'moveCount'
  | 'continuedAfterWin'
>;

function createInitialState(): Omit<
  GameStore,
  | 'commitMove'
  | 'undo'
  | 'restart'
  | 'continueAfterWin'
  | 'setMode'
  | 'setAnimationLock'
> {
  return {
    board: createFreshBoard(),
    score: 0,
    bestScore: 0,
    status: 'playing',
    history: [],
    mode: 'classic',
    undosRemaining: MAX_UNDO_HISTORY,
    moveCount: 0,
    continuedAfterWin: false,
    animationLock: false,
  };
}

/**
 * Game store — session + bestScore/mode persisted for kill/resume DoD.
 * Components must not import this; use `useGameEngine` / selectors.
 */
export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      analytics((set, get) => ({
        ...createInitialState(),

        commitMove: ({ board, scoreDelta }) => {
          const state = get();

          const snapshot: GameSnapshot = {
            board: state.board,
            score: state.score,
            moves: state.moveCount,
            timestamp: Date.now(),
          };
          const history = [...state.history, snapshot].slice(-MAX_UNDO_HISTORY);
          const score = state.score + scoreDelta;
          const bestScore = Math.max(state.bestScore, score);
          const moveCount = state.moveCount + 1;

          let status: GameStore['status'] = 'playing';
          if (!state.continuedAfterWin && isWon(board)) {
            status = 'won';
          } else if (isLost(board)) {
            status = 'lost';
          }

          set({
            board,
            score,
            bestScore,
            history,
            moveCount,
            status,
            animationLock: false,
          });
        },

        undo: () => {
          const state = get();
          if (
            state.animationLock ||
            state.undosRemaining <= 0 ||
            state.history.length === 0
          ) {
            return;
          }
          const history = state.history.slice(0, -1);
          const snapshot = state.history[state.history.length - 1];
          if (snapshot === undefined) {
            return;
          }
          set({
            board: snapshot.board,
            score: snapshot.score,
            moveCount: snapshot.moves,
            history,
            undosRemaining: state.undosRemaining - 1,
            status: 'playing',
            animationLock: false,
          });
        },

        restart: () => {
          const { bestScore, mode } = get();
          set({
            ...createInitialState(),
            board: createFreshBoard(),
            bestScore,
            mode,
          });
        },

        continueAfterWin: () => {
          set({ continuedAfterWin: true, status: 'playing', animationLock: false });
        },

        setMode: (mode) => {
          const { bestScore } = get();
          set({
            ...createInitialState(),
            board: createFreshBoard(),
            bestScore,
            mode,
          });
        },

        setAnimationLock: (locked) => {
          const state = get();
          if (locked) {
            set({ animationLock: true, status: 'animating' });
            return;
          }
          if (state.status === 'animating') {
            set({ animationLock: false, status: 'playing' });
            return;
          }
          set({ animationLock: false });
        },
      })),
      {
        name: STORAGE_KEYS.GAME_STATE,
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state): GamePersistedSlice => ({
          board: state.board,
          score: state.score,
          bestScore: state.bestScore,
          status: state.status === 'animating' ? 'playing' : state.status,
          history: state.history,
          mode: state.mode,
          undosRemaining: state.undosRemaining,
          moveCount: state.moveCount,
          continuedAfterWin: state.continuedAfterWin,
        }),
        merge: (persisted, current) => {
          const slice = persisted as Partial<GamePersistedSlice> | undefined;
          if (slice === undefined || slice === null) {
            return current;
          }
          return {
            ...current,
            ...slice,
            animationLock: false,
            status:
              slice.status === 'animating' ? 'playing' : (slice.status ?? current.status),
          };
        },
      },
    ),
    { name: 'gameStore', enabled: __DEV__ },
  ),
);
