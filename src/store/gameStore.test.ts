/**
 * @file gameStore.test.ts
 * @layer store
 * @description Unit tests for move commit, undo limit, and restart.
 */

import { MAX_UNDO_HISTORY } from '@/constants';
import type { Board } from '@/types';

import { useGameStore } from './gameStore';

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest mock factory
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

function filledBoard(values: Board): Board {
  return values;
}

describe('useGameStore', () => {
  beforeEach(() => {
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
    expect(state.bestScore).toBe(100);
    expect(state.history).toHaveLength(1);
    expect(state.history[0]?.score).toBe(0);
    expect(state.moveCount).toBe(1);
    expect(state.animationLock).toBe(false);
  });

  it('raises bestScore when score exceeds it', () => {
    useGameStore.getState().commitMove({
      board: useGameStore.getState().board,
      scoreDelta: 200,
    });
    expect(useGameStore.getState().bestScore).toBe(200);
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

  it('restart keeps bestScore and resets undos', () => {
    useGameStore.getState().commitMove({
      board: filledBoard([
        4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]),
      scoreDelta: 50,
    });
    useGameStore.setState({ bestScore: 999 });
    useGameStore.getState().restart();
    const state = useGameStore.getState();
    expect(state.bestScore).toBe(999);
    expect(state.score).toBe(0);
    expect(state.undosRemaining).toBe(MAX_UNDO_HISTORY);
    expect(state.history).toHaveLength(0);
    expect(state.status).toBe('playing');
  });
});
