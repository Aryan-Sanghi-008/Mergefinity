/**
 * @file useGameEngine.ts
 * @layer hooks
 * @description Gesture → animate → gameStore commit bridge (P-09).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { SharedValue } from 'react-native-reanimated';

import {
  MERGE_DURATION_MS,
  REDUCED_MOTION_DURATION_MS,
  SLIDE_DURATION_MS,
  SPAWN_DELAY_MS,
  SPAWN_DURATION_MS,
} from '@/constants';
import { resolveMove, spawnTile } from '@/engine';
import { useAnimationLock } from '@/hooks/useAnimationLock';
import { useBoardShake } from '@/hooks/useBoardShake';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useScoreCounter } from '@/hooks/useScoreCounter';
import { useScoreDelta } from '@/hooks/useScoreDelta';
import { useGameStore } from '@/store/gameStore';
import type { BoardTileEntity, Direction, GameStatus } from '@/types';
import { delay } from '@/utils/delay';
import {
  hapticGameOver,
  hapticMerge,
  hapticMove,
  hapticWin,
} from '@/utils/haptics.utils';
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
  /** Visual tile entities. */
  tiles: BoardTileEntity[];
  /** Current score. */
  score: number;
  /** Rolling score shared value. */
  scoreValue: SharedValue<number>;
  /** Best score. */
  bestScore: number;
  /** Rolling best shared value. */
  bestScoreValue: SharedValue<number>;
  /** Undos remaining this game. */
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
  /** Swipe handler. */
  onMove: (direction: Direction) => void;
  /** New game. */
  onNewGame: () => void;
  /** Undo. */
  onUndo: () => void;
  /** Keep going after win. */
  onContinue: () => void;
}

/**
 * Authoritative play loop: store state + Reanimated tile sequencing.
 */
export function useGameEngine(): GameEngineState {
  const score = useGameStore((s) => s.score);
  const bestScore = useGameStore((s) => s.bestScore);
  const status = useGameStore((s) => s.status);
  const undosRemaining = useGameStore((s) => s.undosRemaining);
  const historyLength = useGameStore((s) => s.history.length);
  const storeLock = useGameStore((s) => s.animationLock);

  const commitMove = useGameStore((s) => s.commitMove);
  const undo = useGameStore((s) => s.undo);
  const restart = useGameStore((s) => s.restart);
  const continueAfterWinAction = useGameStore((s) => s.continueAfterWin);
  const setAnimationLock = useGameStore((s) => s.setAnimationLock);

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
  const reducedMotion = useReducedMotion();
  const { locked, lock, unlock } = useAnimationLock();
  const scoreDelta = useScoreDelta();
  const edgePulse = useBoardShake();

  const [tiles, setTiles] = useState(tileSeed.tiles);
  const scoreValue = useScoreCounter(score);
  const bestScoreValue = useScoreCounter(bestScore);

  /** Mirror store lock ↔ SharedValue for gesture worklet. */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability -- Reanimated SharedValue write
    locked.value = storeLock;
  }, [storeLock, locked]);

  /** After persist rehydrate, rebuild tile entities from board. */
  useEffect(() => {
    const syncTiles = () => {
      createIdRef.current = createTileIdFactory();
      motionSeqRef.current = 0;
      setTiles(entitiesFromBoard(useGameStore.getState().board, createIdRef.current));
    };

    if (useGameStore.persist.hasHydrated()) {
      syncTiles();
    }
    return useGameStore.persist.onFinishHydration(syncTiles);
  }, []);

  const phaseMs = useCallback(
    (ms: number) => (reducedMotion ? REDUCED_MOTION_DURATION_MS : ms),
    [reducedMotion],
  );

  const resetTilesFromBoard = useCallback(() => {
    createIdRef.current = createTileIdFactory();
    motionSeqRef.current = 0;
    setTiles(entitiesFromBoard(useGameStore.getState().board, createIdRef.current));
  }, []);

  const onNewGame = useCallback(() => {
    busyRef.current = false;
    unlock();
    restart();
    resetTilesFromBoard();
  }, [unlock, restart, resetTilesFromBoard]);

  const onUndo = useCallback(() => {
    if (busyRef.current || locked.value) {
      return;
    }
    undo();
    resetTilesFromBoard();
  }, [undo, resetTilesFromBoard, locked]);

  const onContinue = useCallback(() => {
    continueAfterWinAction();
  }, [continueAfterWinAction]);

  const onMove = useCallback(
    (direction: Direction) => {
      if (busyRef.current || locked.value || storeLock) {
        return;
      }
      const currentStatus = useGameStore.getState().status;
      if (currentStatus === 'lost' || currentStatus === 'won') {
        return;
      }

      const currentBoard = useGameStore.getState().board;
      const result = resolveMove(currentBoard, direction);
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

          commitMove({ board: afterSpawn, scoreDelta: result.scoreDelta });
          if (result.scoreDelta > 0) {
            scoreDelta.play(result.scoreDelta);
          }

          const nextStatus = useGameStore.getState().status;
          if (nextStatus === 'won') {
            hapticWin();
          } else if (nextStatus === 'lost') {
            hapticGameOver();
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
    ],
  );

  const undoDisabled = undosRemaining <= 0 || historyLength === 0 || status === 'animating';

  return {
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
    onMove,
    onNewGame,
    onUndo,
    onContinue,
  };
}
