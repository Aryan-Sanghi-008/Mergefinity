/**
 * @file gameStore.ts
 * @layer store
 * @description Authoritative game session store — mode-aware (P-09 / P-10).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import {
  MODE_CONFIG,
  MS_PER_SECOND,
  STORAGE_KEYS,
  UNDO_HISTORY_CAP,
  UNDO_UNLIMITED,
} from '@/constants';
import { isLost, isWon } from '@/engine';
import type { GameMode, GameSnapshot, GameStore } from '@/types';
import { createFreshBoard } from '@/utils/createFreshBoard';

import { analytics } from './middleware/analytics.middleware';
import { useStatsStore } from './statsStore';

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
  | 'timerRemainingMs'
>;

function undosForMode(mode: GameMode): number {
  const limit = MODE_CONFIG[mode].undoLimit;
  return limit === null ? UNDO_UNLIMITED : limit;
}

function timerForMode(mode: GameMode): number | null {
  const config = MODE_CONFIG[mode];
  if (!config.hasTimer) {
    return null;
  }
  return config.timerSeconds * MS_PER_SECOND;
}

function createInitialState(mode: GameMode = 'classic'): Omit<
  GameStore,
  | 'commitMove'
  | 'undo'
  | 'restart'
  | 'continueAfterWin'
  | 'setMode'
  | 'setAnimationLock'
  | 'setTimerRemainingMs'
  | 'expireTimer'
> {
  const config = MODE_CONFIG[mode];
  const bestScore = useStatsStore.getState().byMode[mode]?.bestScore ?? 0;
  return {
    board: createFreshBoard(config.boardSize),
    score: 0,
    bestScore,
    status: 'playing',
    history: [],
    mode,
    undosRemaining: undosForMode(mode),
    moveCount: 0,
    continuedAfterWin: false,
    animationLock: false,
    timerRemainingMs: timerForMode(mode),
  };
}

/**
 * Game store — session + mode persisted; best scores live in statsStore.
 */
export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      analytics((set, get) => ({
        ...createInitialState('classic'),

        commitMove: ({ board, scoreDelta }) => {
          const state = get();
          const config = MODE_CONFIG[state.mode];

          const snapshot: GameSnapshot = {
            board: state.board,
            score: state.score,
            moves: state.moveCount,
            timestamp: Date.now(),
          };
          const history = [...state.history, snapshot].slice(-UNDO_HISTORY_CAP);
          const score = state.score + scoreDelta;
          const moveCount = state.moveCount + 1;

          useStatsStore.getState().recordBestScore(state.mode, score);
          const bestScore = useStatsStore.getState().getBestScore(state.mode);

          let status: GameStore['status'] = 'playing';
          if (
            !state.continuedAfterWin &&
            isWon(board, config.winValue)
          ) {
            status = 'won';
          } else if (isLost(board, config.boardSize)) {
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
          const unlimited = state.undosRemaining === UNDO_UNLIMITED;
          if (
            state.animationLock ||
            (!unlimited && state.undosRemaining <= 0) ||
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
            undosRemaining: unlimited
              ? UNDO_UNLIMITED
              : state.undosRemaining - 1,
            status: 'playing',
            animationLock: false,
          });
        },

        restart: () => {
          const { mode } = get();
          set({
            ...createInitialState(mode),
          });
        },

        continueAfterWin: () => {
          set({ continuedAfterWin: true, status: 'playing', animationLock: false });
        },

        setMode: (mode) => {
          set({
            ...createInitialState(mode),
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

        setTimerRemainingMs: (ms) => {
          set({ timerRemainingMs: ms });
        },

        expireTimer: () => {
          const state = get();
          if (!MODE_CONFIG[state.mode].hasTimer) {
            return;
          }
          if (state.status === 'won' || state.status === 'lost') {
            return;
          }
          useStatsStore.getState().recordBestScore(state.mode, state.score);
          set({
            status: 'won',
            timerRemainingMs: 0,
            animationLock: false,
            bestScore: useStatsStore.getState().getBestScore(state.mode),
          });
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
          timerRemainingMs: state.timerRemainingMs,
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
