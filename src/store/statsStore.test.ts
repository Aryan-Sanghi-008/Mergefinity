/**
 * @file statsStore.test.ts
 * @layer store
 * @description Unit tests for stats recording, win rate, and reset DoD.
 */

import { MAX_SESSION_HISTORY } from '@/constants';
import type { CellValue } from '@/types';
import { computeWinRate } from '@/utils/statsHelpers';

import { useStatsStore } from './statsStore';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual(
    '@react-native-async-storage/async-storage/jest/async-storage-mock',
  ),
);

describe('useStatsStore', () => {
  beforeEach(() => {
    useStatsStore.setState({
      byMode: {
        classic: {
          mode: 'classic',
          gamesPlayed: 0,
          wins: 0,
          losses: 0,
          bestScore: 0,
          bestTile: 0,
          totalMerges: 0,
          scoreSum: 0,
        },
        endless: {
          mode: 'endless',
          gamesPlayed: 0,
          wins: 0,
          losses: 0,
          bestScore: 0,
          bestTile: 0,
          totalMerges: 0,
          scoreSum: 0,
        },
        challenge: {
          mode: 'challenge',
          gamesPlayed: 0,
          wins: 0,
          losses: 0,
          bestScore: 0,
          bestTile: 0,
          totalMerges: 0,
          scoreSum: 0,
        },
        'time-attack': {
          mode: 'time-attack',
          gamesPlayed: 0,
          wins: 0,
          losses: 0,
          bestScore: 0,
          bestTile: 0,
          totalMerges: 0,
          scoreSum: 0,
        },
      },
      lifetime: {
        totalGames: 0,
        totalPlayMinutes: 0,
        allTimeBestScore: 0,
        allTimeBestTile: 0,
        currentWinStreak: 0,
        longestWinStreak: 0,
        currentPlayStreakDays: 0,
        longestPlayStreakDays: 0,
        lastPlayDayKey: null,
        consecutiveLosses: 0,
        modesWon: {
          classic: false,
          endless: false,
          challenge: false,
          'time-attack': false,
        },
        mergeHistogram: {},
      },
      sessionHistory: [],
    });
  });

  it('win rate is accurate to the nearest integer across 50 simulated games', () => {
    const wins = 21;
    const losses = 29;
    for (let i = 0; i < wins; i += 1) {
      useStatsStore.getState().recordGameEnd({
        mode: 'classic',
        outcome: 'win',
        score: 1000 + i,
        bestTile: 2048,
        durationSeconds: 120,
      });
    }
    for (let i = 0; i < losses; i += 1) {
      useStatsStore.getState().recordGameEnd({
        mode: 'classic',
        outcome: 'loss',
        score: 200 + i,
        bestTile: 512,
        durationSeconds: 90,
      });
    }
    const stats = useStatsStore.getState().byMode.classic;
    expect(stats.gamesPlayed).toBe(50);
    expect(stats.wins).toBe(wins);
    expect(computeWinRate(stats.wins, stats.gamesPlayed)).toBe(42);
  });

  it('resetStats clears records but keeps best scores and tiles', () => {
    useStatsStore.getState().recordBestScore('classic', 9000);
    useStatsStore.getState().recordGameEnd({
      mode: 'classic',
      outcome: 'win',
      score: 9000,
      bestTile: 4096,
      durationSeconds: 180,
    });
    useStatsStore.getState().recordMerges('classic', [4, 8]);

    useStatsStore.getState().resetStats();

    const state = useStatsStore.getState();
    expect(state.byMode.classic.gamesPlayed).toBe(0);
    expect(state.byMode.classic.wins).toBe(0);
    expect(state.byMode.classic.scoreSum).toBe(0);
    expect(state.byMode.classic.totalMerges).toBe(0);
    expect(state.byMode.classic.bestScore).toBe(9000);
    expect(state.byMode.classic.bestTile).toBe(4096);
    expect(state.lifetime.totalGames).toBe(0);
    expect(state.lifetime.mergeHistogram).toEqual({});
    expect(state.lifetime.allTimeBestScore).toBe(9000);
    expect(state.lifetime.allTimeBestTile).toBe(4096);
    expect(state.sessionHistory).toEqual([]);
  });

  it('caps session history at MAX_SESSION_HISTORY', () => {
    for (let i = 0; i < MAX_SESSION_HISTORY + 3; i += 1) {
      useStatsStore.getState().recordGameEnd({
        mode: 'classic',
        outcome: 'loss',
        score: i,
        bestTile: 2,
        durationSeconds: 10,
      });
    }
    expect(useStatsStore.getState().sessionHistory).toHaveLength(
      MAX_SESSION_HISTORY,
    );
    expect(useStatsStore.getState().sessionHistory[0]?.score).toBe(3);
  });

  it('recordMerges updates histogram and per-mode totals', () => {
    useStatsStore.getState().recordMerges('classic', [4 as CellValue, 4, 8]);
    const state = useStatsStore.getState();
    expect(state.byMode.classic.totalMerges).toBe(3);
    expect(state.lifetime.mergeHistogram[4]).toBe(2);
    expect(state.lifetime.mergeHistogram[8]).toBe(1);
  });

  it('tracks win streak across games', () => {
    useStatsStore.getState().recordGameEnd({
      mode: 'classic',
      outcome: 'win',
      score: 100,
      bestTile: 2048,
      durationSeconds: 60,
    });
    useStatsStore.getState().recordGameEnd({
      mode: 'classic',
      outcome: 'win',
      score: 200,
      bestTile: 2048,
      durationSeconds: 60,
    });
    useStatsStore.getState().recordGameEnd({
      mode: 'classic',
      outcome: 'loss',
      score: 50,
      bestTile: 256,
      durationSeconds: 60,
    });
    const { lifetime } = useStatsStore.getState();
    expect(lifetime.currentWinStreak).toBe(0);
    expect(lifetime.longestWinStreak).toBe(2);
  });
});
