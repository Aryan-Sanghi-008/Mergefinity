/**
 * @file gameStore.test.ts
 * @layer store
 * @description Unit tests for move commit, undo limit, restart, and stats recording.
 */

import { MAX_UNDO_HISTORY, MODE_CONFIG, MS_PER_SECOND, UNDO_UNLIMITED } from '@/constants';
import type { Board, CellValue } from '@/types';
import { createEmptyLifetimeStats, createEmptyStatsByMode } from '@/utils/statsDefaults';

import { useGameStore } from './gameStore';
import { useStatsStore } from './statsStore';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual(
    '@react-native-async-storage/async-storage/jest/async-storage-mock',
  ),
);

function filledBoard(values: Board): Board {
  return values;
}

describe('useGameStore', () => {
  beforeEach(() => {
    useStatsStore.setState({
      byMode: createEmptyStatsByMode(),
      lifetime: createEmptyLifetimeStats(),
      sessionHistory: [],
    });
    useGameStore.setState({
      board: filledBoard([
        2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]),
      score: 0,
      bestScore: 100,
      status: 'playing',
      history: [],
      mode: 'classic',
      undosRemaining: MAX_UNDO_HISTORY,
      moveCount: 0,
      continuedAfterWin: false,
      animationLock: false,
      timerRemainingMs: null,
      sessionStartedAt: Date.now(),
      statsRecorded: false,
    });
  });

  it('commitMove updates score, history, and bestScore', () => {
    const next = filledBoard([
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
    useGameStore.getState().commitMove({
      board: next,
      scoreDelta: 4,
      mergeValues: [4],
    });
    const state = useGameStore.getState();
    expect(state.board).toEqual(next);
    expect(state.score).toBe(4);
    expect(state.history).toHaveLength(1);
    expect(state.moveCount).toBe(1);
    expect(state.animationLock).toBe(false);
  });

  it('records per-mode best score in statsStore', () => {
    useGameStore.getState().commitMove({
      board: useGameStore.getState().board,
      scoreDelta: 200,
      mergeValues: [],
    });
    expect(useStatsStore.getState().getBestScore('classic')).toBeGreaterThanOrEqual(200);
  });

  it('records merges into the histogram on commit', () => {
    useGameStore.getState().commitMove({
      board: useGameStore.getState().board,
      scoreDelta: 4,
      mergeValues: [4 as CellValue, 8],
    });
    expect(useStatsStore.getState().byMode.classic.totalMerges).toBe(2);
    expect(useStatsStore.getState().lifetime.mergeHistogram[4]).toBe(1);
    expect(useStatsStore.getState().lifetime.mergeHistogram[8]).toBe(1);
  });

  it('records a win once and ignores later loss after continue', () => {
    const winBoard = filledBoard([
      2048, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2, 4, 8, 16, 32,
    ]);
    useGameStore.getState().commitMove({
      board: winBoard,
      scoreDelta: 2048,
      mergeValues: [2048],
    });
    expect(useGameStore.getState().status).toBe('won');
    expect(useGameStore.getState().statsRecorded).toBe(true);
    expect(useStatsStore.getState().byMode.classic.wins).toBe(1);
    expect(useStatsStore.getState().lifetime.totalGames).toBe(1);

    useGameStore.getState().continueAfterWin();
    const lossBoard = filledBoard([
      2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2, 4, 8, 16, 32, 64,
    ]);
    useGameStore.getState().commitMove({
      board: lossBoard,
      scoreDelta: 0,
      mergeValues: [],
    });
    expect(useGameStore.getState().status).toBe('lost');
    expect(useStatsStore.getState().byMode.classic.wins).toBe(1);
    expect(useStatsStore.getState().byMode.classic.losses).toBe(0);
    expect(useStatsStore.getState().lifetime.totalGames).toBe(1);
  });

  it('undo restores board and score and decrements undosRemaining', () => {
    const after = filledBoard([
      4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
    useGameStore.getState().commitMove({
      board: after,
      scoreDelta: 4,
      mergeValues: [4],
    });
    useGameStore.getState().undo();
    const state = useGameStore.getState();
    expect(state.board[0]).toBe(2);
    expect(state.score).toBe(0);
    expect(state.undosRemaining).toBe(MAX_UNDO_HISTORY - 1);
    expect(state.history).toHaveLength(0);
  });

  it('disables undo after MAX_UNDO_HISTORY uses', () => {
    for (let i = 0; i < MAX_UNDO_HISTORY; i += 1) {
      useGameStore.getState().commitMove({
        board: filledBoard([
          2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ]),
        scoreDelta: 2,
        mergeValues: [],
      });
      useGameStore.getState().undo();
    }
    expect(useGameStore.getState().undosRemaining).toBe(0);
    useGameStore.getState().commitMove({
      board: filledBoard([
        8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]),
      scoreDelta: 8,
      mergeValues: [],
    });
    useGameStore.getState().undo();
    expect(useGameStore.getState().undosRemaining).toBe(0);
    expect(useGameStore.getState().board[0]).toBe(8);
  });

  it('time-attack undos remain unlimited', () => {
    useGameStore.getState().setMode('time-attack');
    expect(useGameStore.getState().undosRemaining).toBe(UNDO_UNLIMITED);
    expect(useGameStore.getState().timerRemainingMs).toBe(
      MODE_CONFIG['time-attack'].timerSeconds * MS_PER_SECOND,
    );
    useGameStore.getState().commitMove({
      board: filledBoard([
        2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]),
      scoreDelta: 2,
      mergeValues: [],
    });
    useGameStore.getState().undo();
    expect(useGameStore.getState().undosRemaining).toBe(UNDO_UNLIMITED);
  });

  it('challenge uses 5x5 board and 1 undo', () => {
    useGameStore.getState().setMode('challenge');
    const state = useGameStore.getState();
    expect(state.board).toHaveLength(25);
    expect(state.undosRemaining).toBe(1);
  });

  it('expireTimer marks time-attack as won and records stats', () => {
    useGameStore.getState().setMode('time-attack');
    useGameStore.setState({ score: 42, statsRecorded: false });
    useGameStore.getState().expireTimer();
    expect(useGameStore.getState().status).toBe('won');
    expect(useGameStore.getState().timerRemainingMs).toBe(0);
    expect(useGameStore.getState().statsRecorded).toBe(true);
    expect(useStatsStore.getState().byMode['time-attack'].wins).toBe(1);
  });

  it('restart keeps mode and resets undos', () => {
    useGameStore.getState().setMode('challenge');
    useGameStore.getState().commitMove({
      board: Array.from({ length: 25 }, () => 0) as Board,
      scoreDelta: 50,
      mergeValues: [],
    });
    useGameStore.getState().restart();
    const state = useGameStore.getState();
    expect(state.mode).toBe('challenge');
    expect(state.score).toBe(0);
    expect(state.undosRemaining).toBe(1);
    expect(state.board).toHaveLength(25);
    expect(state.statsRecorded).toBe(false);
  });
});
