/**
 * @file gameStore.ts
 * @layer store
 * @description Authoritative game session store — mode-aware (P-09 / P-10 / P-11).
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
import { maxBoardTile } from '@/utils/statsHelpers';

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
  | 'sessionStartedAt'
  | 'statsRecorded'
  | 'undosUsed'
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
    sessionStartedAt: Date.now(),
    statsRecorded: false,
    undosUsed: 0,
  };
}

function durationSecondsSince(sessionStartedAt: number): number {
  return Math.max(0, Math.floor((Date.now() - sessionStartedAt) / MS_PER_SECOND));
}

function recordTerminalIfNeeded(
  state: GameStore,
  outcome: 'win' | 'loss',
  board: GameStore['board'],
  score: number,
): boolean {
  if (state.statsRecorded) {
    return false;
  }
  useStatsStore.getState().recordGameEnd({
    mode: state.mode,
    outcome,
    score,
    bestTile: maxBoardTile(board),
    durationSeconds: durationSecondsSince(state.sessionStartedAt),
  });
  return true;
}

/**
 * Game store — session + mode persisted; best scores live in statsStore.
 */
export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      analytics((set, get) => ({
        ...createInitialState('classic'),

        commitMove: ({ board, scoreDelta, mergeValues }) => {
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

          if (mergeValues.length > 0) {
            useStatsStore.getState().recordMerges(state.mode, mergeValues);
          }

          useStatsStore.getState().recordBestScore(state.mode, score);
          const bestScore = useStatsStore.getState().getBestScore(state.mode);

          let status: GameStore['status'] = 'playing';
          let statsRecorded = state.statsRecorded;
          if (
            !state.continuedAfterWin &&
            isWon(board, config.winValue)
          ) {
            status = 'won';
            if (recordTerminalIfNeeded(state, 'win', board, score)) {
              statsRecorded = true;
            }
          } else if (isLost(board, config.boardSize)) {
            status = 'lost';
            if (recordTerminalIfNeeded(state, 'loss', board, score)) {
              statsRecorded = true;
            }
          }

          set({
            board,
            score,
            bestScore,
            history,
            moveCount,
            status,
            animationLock: false,
            statsRecorded,
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
            undosUsed: state.undosUsed + 1,
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
          let statsRecorded = state.statsRecorded;
          if (recordTerminalIfNeeded(state, 'win', state.board, state.score)) {
            statsRecorded = true;
          }
          set({
            status: 'won',
            timerRemainingMs: 0,
            animationLock: false,
            bestScore: useStatsStore.getState().getBestScore(state.mode),
            statsRecorded,
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
          sessionStartedAt: state.sessionStartedAt,
          statsRecorded: state.statsRecorded,
          undosUsed: state.undosUsed,
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
            sessionStartedAt: slice.sessionStartedAt ?? current.sessionStartedAt,
            statsRecorded: slice.statsRecorded ?? current.statsRecorded,
            undosUsed: slice.undosUsed ?? current.undosUsed,
            status:
              slice.status === 'animating' ? 'playing' : (slice.status ?? current.status),
          };
        },
      },
    ),
    { name: 'gameStore', enabled: __DEV__ },
  ),
);
