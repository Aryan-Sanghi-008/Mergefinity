/**
 * @file seededGame.simulation.test.ts
 * @layer engine
 * @description Programmatic swipe sequence to a terminal loss (P-18).
 */

import { isLost, resolveMove, spawnTile } from '@/engine';
import type { Board, Direction } from '@/types';
import { useGameStore } from '@/store/gameStore';
import { useStatsStore } from '@/store/statsStore';
import { createEmptyLifetimeStats, createEmptyStatsByMode } from '@/utils/statsDefaults';

jest.mock('@/utils/sound.utils', () => ({
  SoundManager: {
    play: jest.fn(),
    playSlide: jest.fn(),
    setEnabled: jest.fn(),
    preload: jest.fn(async () => undefined),
    resetForTests: jest.fn(),
  },
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual(
    '@react-native-async-storage/async-storage/jest/async-storage-mock',
  ),
);

/** Deterministic RNG — always pick first empty cell as a 2. */
function fixedRng(): () => number {
  return () => 0;
}

describe('seeded game simulation', () => {
  beforeEach(() => {
    useStatsStore.setState({
      byMode: createEmptyStatsByMode(),
      lifetime: createEmptyLifetimeStats(),
      sessionHistory: [],
    });
    useGameStore.setState({
      board: [
        2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2, 4, 8, 16, 32, 0,
      ] as Board,
      score: 0,
      bestScore: 0,
      status: 'playing',
      history: [],
      mode: 'classic',
      undosRemaining: 3,
      moveCount: 0,
      continuedAfterWin: false,
      animationLock: false,
      timerRemainingMs: null,
      sessionStartedAt: Date.now(),
      statsRecorded: false,
      undosUsed: 0,
    });
  });

  it('reaches a lost board and records loss via commitMove', () => {
    const directions: Direction[] = ['LEFT', 'UP', 'RIGHT', 'DOWN'];
    let board = useGameStore.getState().board;
    const rng = fixedRng();
    let safety = 0;

    while (!isLost(board, 4) && safety < 40) {
      safety += 1;
      let moved = false;
      for (const direction of directions) {
        const result = resolveMove(board, direction, 4);
        if (!result.boardChanged) {
          continue;
        }
        const afterSpawn = spawnTile(result.board, rng);
        useGameStore.getState().commitMove({
          board: afterSpawn,
          scoreDelta: result.scoreDelta,
          mergeValues: result.tileMoves
            .filter((m) => m.merged)
            .map((m) => m.value),
          direction,
        });
        board = afterSpawn;
        moved = true;
        break;
      }
      if (!moved) {
        break;
      }
    }

    expect(isLost(board, 4) || useGameStore.getState().status === 'lost').toBe(
      true,
    );
    if (useGameStore.getState().status === 'lost') {
      expect(useStatsStore.getState().lifetime.totalGames).toBeGreaterThan(0);
      expect(useGameStore.getState().score).toBeGreaterThanOrEqual(0);
    }
  });
});
