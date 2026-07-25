/**
 * @file useDemoGame.ts
 * @layer hooks
 * @description Playable demo session with slide→merge→spawn sequencing (P-07).
 *              Replaced by Zustand `useGameEngine` in P-09.
 */

import { useCallback, useRef, useState } from 'react';
import type { SharedValue } from 'react-native-reanimated';

import {
  MERGE_DURATION_MS,
  REDUCED_MOTION_DURATION_MS,
  SLIDE_DURATION_MS,
  SPAWN_DELAY_MS,
  SPAWN_DURATION_MS,
} from '@/constants';
import {
  createEmptyBoard,
  isLost,
  isWon,
  resolveMove,
  spawnTile,
} from '@/engine';
import { useAnimationLock } from '@/hooks/useAnimationLock';
import { useBoardShake } from '@/hooks/useBoardShake';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useScoreCounter } from '@/hooks/useScoreCounter';
import { useScoreDelta } from '@/hooks/useScoreDelta';
import type { Board, BoardTileEntity, Direction, GameStatus } from '@/types';
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

/** Demo / pre-store game surface for the game screen. */
export interface DemoGameState {
  /** Engine board (post-move truth). */
  board: Board;
  /** Visual tile entities for AnimatedTile. */
  tiles: BoardTileEntity[];
  /** Current score (number for logic). */
  score: number;
  /** Rolling score shared value for ScoreValue. */
  scoreValue: SharedValue<number>;
  /** Best score number. */
  bestScore: number;
  /** Rolling best shared value. */
  bestScoreValue: SharedValue<number>;
  /** Remaining undos (none until store history). */
  undoRemaining: number;
  /** Undo disabled until P-09. */
  undoDisabled: boolean;
  /** Win / lose / playing status. */
  status: GameStatus;
  /** True after first 2048 if player chose Keep Going. */
  continuedAfterWin: boolean;
  /** Score delta float API. */
  scoreDelta: ReturnType<typeof useScoreDelta>;
  /** Edge pulse API. */
  edgePulse: ReturnType<typeof useBoardShake>;
  /** Animation lock shared value for gestures. */
  animationLock: SharedValue<boolean>;
  /** Swipe / move handler. */
  onMove: (direction: Direction) => void;
  /** Reseed a fresh two-tile board. */
  onNewGame: () => void;
  /** No-op until undo history exists. */
  onUndo: () => void;
  /** Dismiss win overlay and keep playing. */
  onContinue: () => void;
}

/** Deterministic RNG for opening seed only. */
function demoRng(): number {
  return 0;
}

function createDemoBoard(): Board {
  let board = createEmptyBoard();
  board = spawnTile(board, demoRng);
  board = spawnTile(board, demoRng);
  return board;
}

/**
 * Local playable game with animation sequencing until P-09 store lands.
 */
export function useDemoGame(): DemoGameState {
  const [opening] = useState(() => {
    const createId = createTileIdFactory();
    const openingBoard = createDemoBoard();
    return {
      createId,
      board: openingBoard,
      tiles: entitiesFromBoard(openingBoard, createId),
    };
  });

  const createIdRef = useRef(opening.createId);
  const motionSeqRef = useRef(0);
  const busyRef = useRef(false);
  const reducedMotion = useReducedMotion();
  const { locked, lock, unlock } = useAnimationLock();
  const scoreDelta = useScoreDelta();
  const edgePulse = useBoardShake();

  const [board, setBoard] = useState(opening.board);
  const [tiles, setTiles] = useState(opening.tiles);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [continuedAfterWin, setContinuedAfterWin] = useState(false);

  const scoreValue = useScoreCounter(score);
  const bestScoreValue = useScoreCounter(bestScore);

  const phaseMs = useCallback(
    (ms: number) => (reducedMotion ? REDUCED_MOTION_DURATION_MS : ms),
    [reducedMotion],
  );

  const onNewGame = useCallback(() => {
    busyRef.current = false;
    unlock();
    createIdRef.current = createTileIdFactory();
    motionSeqRef.current = 0;
    const next = createDemoBoard();
    setBoard(next);
    setTiles(entitiesFromBoard(next, createIdRef.current));
    setScore(0);
    setStatus('playing');
    setContinuedAfterWin(false);
  }, [unlock]);

  const onUndo = useCallback(() => {
    // Undo requires snapshot history — wired in P-09.
  }, []);

  const onContinue = useCallback(() => {
    setContinuedAfterWin(true);
    setStatus('playing');
  }, []);

  const onMove = useCallback(
    (direction: Direction) => {
      if (busyRef.current || locked.value) {
        return;
      }
      if (status === 'lost' || status === 'won') {
        return;
      }

      const result = resolveMove(board, direction);
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
      setStatus('animating');

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
          setBoard(afterSpawn);

          const nextScore = score + result.scoreDelta;
          setScore(nextScore);
          if (result.scoreDelta > 0) {
            scoreDelta.play(result.scoreDelta);
          }
          if (nextScore > bestScore) {
            setBestScore(nextScore);
          }

          if (!continuedAfterWin && isWon(afterSpawn)) {
            hapticWin();
            setStatus('won');
          } else if (isLost(afterSpawn)) {
            hapticGameOver();
            setStatus('lost');
          } else {
            setStatus('playing');
          }
        } finally {
          unlock();
          busyRef.current = false;
        }
      })();
    },
    [
      board,
      tiles,
      score,
      bestScore,
      status,
      continuedAfterWin,
      lock,
      unlock,
      locked,
      edgePulse,
      scoreDelta,
      phaseMs,
    ],
  );

  return {
    board,
    tiles,
    score,
    scoreValue,
    bestScore,
    bestScoreValue,
    undoRemaining: 0,
    undoDisabled: true,
    status,
    continuedAfterWin,
    scoreDelta,
    edgePulse,
    animationLock: locked,
    onMove,
    onNewGame,
    onUndo,
    onContinue,
  };
}
