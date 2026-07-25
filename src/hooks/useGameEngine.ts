/**
 * @file useGameEngine.ts
 * @layer hooks
 * @description Gesture → animate → gameStore commit bridge (P-09 / P-10).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import {
  MERGE_DURATION_MS,
  MODE_CONFIG,
  REDUCED_MOTION_DURATION_MS,
  SLIDE_DURATION_MS,
  SPAWN_DELAY_MS,
  SPAWN_DURATION_MS,
  UNDO_UNLIMITED,
} from '@/constants';
import { resolveMove, spawnTile } from '@/engine';
import { useAchievementChecker } from '@/hooks/useAchievementChecker';
import { useAchievementQueue } from '@/hooks/useAchievementQueue';
import { useAnimationLock } from '@/hooks/useAnimationLock';
import { useBoardShake } from '@/hooks/useBoardShake';
import { useCountdown } from '@/hooks/useCountdown';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useScoreCounter } from '@/hooks/useScoreCounter';
import { useScoreDelta } from '@/hooks/useScoreDelta';
import { useGameStore } from '@/store/gameStore';
import { useStatsStore } from '@/store/statsStore';
import type {
  AchievementId,
  BoardTileEntity,
  Direction,
  GameMode,
  GameStatus,
} from '@/types';
import { delay } from '@/utils/delay';
import {
  hapticGameOver,
  hapticMerge,
  hapticMove,
  hapticWin,
} from '@/utils/haptics.utils';
import {
  preloadInterstitial,
  showInterstitialIfEligible,
} from '@/utils/ads.utils';
import { mergeValuesFromMoves } from '@/utils/statsHelpers';
import {
  createTileIdFactory,
  entitiesForMerge,
  entitiesForSlide,
  entitiesFromBoard,
  entitiesSettled,
  entitiesWithSpawn,
} from '@/utils/tileEntities';

/** Game screen surface from the engine hook. */
export interface GameEngineState {
  /** Active mode. */
  mode: GameMode;
  /** Cells per axis for the board. */
  cellCount: number;
  /** Visual tile entities. */
  tiles: BoardTileEntity[];
  /** Current score. */
  score: number;
  /** Rolling score shared value. */
  scoreValue: SharedValue<number>;
  /** Best score for active mode. */
  bestScore: number;
  /** Rolling best shared value. */
  bestScoreValue: SharedValue<number>;
  /** Undos remaining (`-1` = unlimited). */
  undoRemaining: number;
  /** Undo control disabled. */
  undoDisabled: boolean;
  /** Lifecycle status. */
  status: GameStatus;
  /** Score delta float API. */
  scoreDelta: ReturnType<typeof useScoreDelta>;
  /** Edge pulse API. */
  edgePulse: ReturnType<typeof useBoardShake>;
  /** SharedValue lock for pan worklet. */
  animationLock: SharedValue<boolean>;
  /** Time Attack remaining ms shared value (0 when no timer). */
  timerRemaining: SharedValue<number>;
  /** Whether the active mode uses a timer. */
  hasTimer: boolean;
  /** True when win came from timer expiry (no Keep Going). */
  isTimeUpWin: boolean;
  /** Current achievement toast id. */
  achievementToastId: AchievementId | null;
  /** Dismiss current achievement toast. */
  onAchievementToastDismiss: () => void;
  /** Swipe handler. */
  onMove: (direction: Direction) => void;
  /** New game. */
  onNewGame: () => void;
  /** Undo. */
  onUndo: () => void;
  /** Keep going after tile win. */
  onContinue: () => void;
}

/**
 * Authoritative play loop: store state + Reanimated tile sequencing + timer.
 */
export function useGameEngine(): GameEngineState {
  const mode = useGameStore((s) => s.mode);
  const score = useGameStore((s) => s.score);
  const bestScore = useGameStore((s) => s.bestScore);
  const status = useGameStore((s) => s.status);
  const undosRemaining = useGameStore((s) => s.undosRemaining);
  const historyLength = useGameStore((s) => s.history.length);
  const storeLock = useGameStore((s) => s.animationLock);
  const timerRemainingMs = useGameStore((s) => s.timerRemainingMs);

  const commitMove = useGameStore((s) => s.commitMove);
  const undo = useGameStore((s) => s.undo);
  const restart = useGameStore((s) => s.restart);
  const continueAfterWinAction = useGameStore((s) => s.continueAfterWin);
  const setAnimationLock = useGameStore((s) => s.setAnimationLock);
  const setTimerRemainingMs = useGameStore((s) => s.setTimerRemainingMs);
  const expireTimer = useGameStore((s) => s.expireTimer);

  const config = MODE_CONFIG[mode];
  const cellCount = config.boardSize;
  const hasTimer = config.hasTimer;

  const [tileSeed] = useState(() => {
    const createId = createTileIdFactory();
    return {
      createId,
      tiles: entitiesFromBoard(useGameStore.getState().board, createId),
    };
  });
  const createIdRef = useRef(tileSeed.createId);
  const motionSeqRef = useRef(0);
  const busyRef = useRef(false);
  const [appActive, setAppActive] = useState(true);
  const [isTimeUpWin, setIsTimeUpWin] = useState(false);
  const reducedMotion = useReducedMotion();
  const { locked, lock, unlock } = useAnimationLock();
  const scoreDelta = useScoreDelta();
  const edgePulse = useBoardShake();
  const evaluateAchievements = useAchievementChecker();
  const {
    currentId: achievementToastId,
    enqueue: enqueueAchievements,
    dismiss: onAchievementToastDismiss,
  } = useAchievementQueue();

  const [tiles, setTiles] = useState(tileSeed.tiles);
  const scoreValue = useScoreCounter(score);
  const bestScoreValue = useScoreCounter(bestScore);

  useEffect(() => {
    locked.set(storeLock);
  }, [storeLock, locked]);

  useEffect(() => {
    preloadInterstitial();
  }, []);

  useEffect(() => {
    const onChange = (next: AppStateStatus) => {
      const active = next === 'active';
      setAppActive(active);
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, []);

  const onExpire = useCallback(() => {
    const lossesBefore = useStatsStore.getState().lifetime.consecutiveLosses;
    const wasRecorded = useGameStore.getState().statsRecorded;
    setIsTimeUpWin(true);
    expireTimer();
    hapticWin();
    const after = useGameStore.getState();
    const justWon = after.statsRecorded && !wasRecorded;
    const unlocked = evaluateAchievements({
      justWon,
      consecutiveLossesBeforeWin: lossesBefore,
    });
    enqueueAchievements(unlocked);
  }, [expireTimer, evaluateAchievements, enqueueAchievements]);

  const timerPaused =
    !appActive ||
    status === 'animating' ||
    status === 'won' ||
    status === 'lost' ||
    !hasTimer;

  const { remainingMs: timerRemaining } = useCountdown({
    remainingMs: hasTimer ? timerRemainingMs : null,
    paused: timerPaused,
    onExpire,
    onTick: setTimerRemainingMs,
  });

  useEffect(() => {
    const syncTiles = () => {
      createIdRef.current = createTileIdFactory();
      motionSeqRef.current = 0;
      setTiles(entitiesFromBoard(useGameStore.getState().board, createIdRef.current));
      setIsTimeUpWin(false);
    };

    if (useGameStore.persist.hasHydrated()) {
      syncTiles();
    }
    return useGameStore.persist.onFinishHydration(syncTiles);
  }, []);

  /** Rebuild tiles when mode / board size changes. */
  useEffect(() => {
    createIdRef.current = createTileIdFactory();
    motionSeqRef.current = 0;
    setTiles(entitiesFromBoard(useGameStore.getState().board, createIdRef.current));
    setIsTimeUpWin(false);
  }, [mode, cellCount]);

  const phaseMs = useCallback(
    (ms: number) => (reducedMotion ? REDUCED_MOTION_DURATION_MS : ms),
    [reducedMotion],
  );

  const resetTilesFromBoard = useCallback(() => {
    createIdRef.current = createTileIdFactory();
    motionSeqRef.current = 0;
    setTiles(entitiesFromBoard(useGameStore.getState().board, createIdRef.current));
    setIsTimeUpWin(false);
  }, []);

  const onNewGame = useCallback(() => {
    busyRef.current = false;
    unlock();
    restart();
    resetTilesFromBoard();
    preloadInterstitial();
  }, [unlock, restart, resetTilesFromBoard]);

  const onUndo = useCallback(() => {
    if (busyRef.current || locked.get()) {
      return;
    }
    undo();
    resetTilesFromBoard();
  }, [undo, resetTilesFromBoard, locked]);

  const onContinue = useCallback(() => {
    continueAfterWinAction();
    setIsTimeUpWin(false);
  }, [continueAfterWinAction]);

  const onMove = useCallback(
    (direction: Direction) => {
      if (busyRef.current || locked.get() || storeLock) {
        return;
      }
      const currentStatus = useGameStore.getState().status;
      if (currentStatus === 'lost' || currentStatus === 'won') {
        return;
      }

      const currentBoard = useGameStore.getState().board;
      const boardSize = MODE_CONFIG[useGameStore.getState().mode].boardSize;
      const result = resolveMove(currentBoard, direction, boardSize);
      if (!result.boardChanged) {
        edgePulse.pulse();
        return;
      }

      const hasMerge = result.tileMoves.some((move) => move.merged);
      if (hasMerge) {
        hapticMerge();
      } else {
        hapticMove();
      }

      busyRef.current = true;
      lock();
      setAnimationLock(true);

      void (async () => {
        try {
          motionSeqRef.current += 1;
          const seq = motionSeqRef.current;
          const slideTiles = entitiesForSlide(tiles, result.tileMoves, seq);
          setTiles(slideTiles);
          await delay(phaseMs(SLIDE_DURATION_MS));

          motionSeqRef.current += 1;
          const mergeTiles = entitiesForMerge(
            slideTiles,
            result.tileMoves,
            motionSeqRef.current,
          );
          setTiles(mergeTiles);
          await delay(phaseMs(MERGE_DURATION_MS));

          const beforeSpawn = result.board;
          const afterSpawn = spawnTile(beforeSpawn);
          motionSeqRef.current += 1;
          const spawnTiles = entitiesWithSpawn(
            mergeTiles,
            beforeSpawn,
            afterSpawn,
            createIdRef.current,
            motionSeqRef.current,
          );
          setTiles(spawnTiles);
          await delay(phaseMs(SPAWN_DELAY_MS + SPAWN_DURATION_MS));

          motionSeqRef.current += 1;
          setTiles(entitiesSettled(spawnTiles, motionSeqRef.current));

          const lossesBefore = useStatsStore.getState().lifetime.consecutiveLosses;
          const wasRecorded = useGameStore.getState().statsRecorded;
          const priorTotalGames = useStatsStore.getState().lifetime.totalGames;
          commitMove({
            board: afterSpawn,
            scoreDelta: result.scoreDelta,
            mergeValues: mergeValuesFromMoves(result.tileMoves),
            direction,
          });
          if (result.scoreDelta > 0) {
            scoreDelta.play(result.scoreDelta);
          }

          const next = useGameStore.getState();
          const justWon =
            next.statsRecorded && !wasRecorded && next.status === 'won';
          const justLost =
            next.statsRecorded && !wasRecorded && next.status === 'lost';
          const unlocked = evaluateAchievements({
            justWon,
            justLost,
            consecutiveLossesBeforeWin: lossesBefore,
          });
          enqueueAchievements(unlocked);

          if (next.status === 'won') {
            hapticWin();
          } else if (next.status === 'lost') {
            hapticGameOver();
            if (justLost) {
              void showInterstitialIfEligible({
                outcome: 'loss',
                priorTotalGames,
              });
            }
          }
        } finally {
          unlock();
          busyRef.current = false;
        }
      })();
    },
    [
      tiles,
      lock,
      unlock,
      locked,
      storeLock,
      setAnimationLock,
      commitMove,
      edgePulse,
      scoreDelta,
      phaseMs,
      evaluateAchievements,
      enqueueAchievements,
    ],
  );

  const unlimited = undosRemaining === UNDO_UNLIMITED;
  const undoDisabled =
    historyLength === 0 ||
    status === 'animating' ||
    (!unlimited && undosRemaining <= 0);

  return {
    mode,
    cellCount,
    tiles,
    score,
    scoreValue,
    bestScore,
    bestScoreValue,
    undoRemaining: undosRemaining,
    undoDisabled,
    status,
    scoreDelta,
    edgePulse,
    animationLock: locked,
    timerRemaining,
    hasTimer,
    isTimeUpWin,
    achievementToastId,
    onAchievementToastDismiss,
    onMove,
    onNewGame,
    onUndo,
    onContinue,
  };
}
