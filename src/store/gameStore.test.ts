/**
 * @file gameStore.test.ts
 * @layer store
 * @description Unit tests for move commit, undo limit, and restart.
 */

import { MAX_UNDO_HISTORY, MODE_CONFIG, MS_PER_SECOND, UNDO_UNLIMITED } from '@/constants';
import type { Board } from '@/types';

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
      byMode: useStatsStore.getState().byMode,
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
    });
  });

  it('commitMove updates score, history, and bestScore', () => {
    const next = filledBoard([
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
    useGameStore.getState().commitMove({ board: next, scoreDelta: 4 });
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
    });
    expect(useStatsStore.getState().getBestScore('classic')).toBeGreaterThanOrEqual(200);
  });

  it('undo restores board and score and decrements undosRemaining', () => {
    const after = filledBoard([
      4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
    useGameStore.getState().commitMove({ board: after, scoreDelta: 4 });
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
      });
      useGameStore.getState().undo();
    }
    expect(useGameStore.getState().undosRemaining).toBe(0);
    useGameStore.getState().commitMove({
      board: filledBoard([
        8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]),
      scoreDelta: 8,
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

  it('expireTimer marks time-attack as won', () => {
    useGameStore.getState().setMode('time-attack');
    useGameStore.setState({ score: 42 });
    useGameStore.getState().expireTimer();
    expect(useGameStore.getState().status).toBe('won');
    expect(useGameStore.getState().timerRemainingMs).toBe(0);
  });

  it('restart keeps mode and resets undos', () => {
    useGameStore.getState().setMode('challenge');
    useGameStore.getState().commitMove({
      board: Array.from({ length: 25 }, () => 0) as Board,
      scoreDelta: 50,
    });
    useGameStore.getState().restart();
    const state = useGameStore.getState();
    expect(state.mode).toBe('challenge');
    expect(state.score).toBe(0);
    expect(state.undosRemaining).toBe(1);
    expect(state.board).toHaveLength(25);
  });
});
