/**
 * @file modes.constants.ts
 * @layer constants
 * @description Per-mode board / win / undo / timer config (P-10).
 */

import type { CellValue, GameMode } from '@/types';

/** Runtime configuration for one play mode. */
export interface ModeConfig {
  /** Cells per axis. */
  boardSize: number;
  /** Tile value that triggers a win; `null` = no tile-based win. */
  winValue: CellValue | null;
  /** Undos allowed per game; `null` = unlimited. */
  undoLimit: number | null;
  /** Whether a countdown timer runs. */
  hasTimer: boolean;
  /** Timer length in seconds (0 when `hasTimer` is false). */
  timerSeconds: number;
}

/** Mode → rules map consumed by gameStore / hooks. */
export const MODE_CONFIG: Record<GameMode, ModeConfig> = {
  classic: {
    boardSize: 4,
    winValue: 2048,
    undoLimit: 3,
    hasTimer: false,
    timerSeconds: 0,
  },
  endless: {
    boardSize: 4,
    winValue: null,
    undoLimit: 3,
    hasTimer: false,
    timerSeconds: 0,
  },
  challenge: {
    boardSize: 5,
    winValue: 4096,
    undoLimit: 1,
    hasTimer: false,
    timerSeconds: 0,
  },
  'time-attack': {
    boardSize: 4,
    winValue: null,
    undoLimit: null,
    hasTimer: true,
    timerSeconds: 120,
  },
};

/** Ordered mode list for selectors / tabs. */
export const GAME_MODES: readonly GameMode[] = [
  'classic',
  'endless',
  'challenge',
  'time-attack',
] as const;

/** Sentinel undosRemaining value meaning unlimited. */
export const UNDO_UNLIMITED = -1;

/** Max undo snapshots retained (even when undos are unlimited). */
export const UNDO_HISTORY_CAP = 3;

/** Milliseconds in one second (timer display / countdown). */
export const MS_PER_SECOND = 1000;

/** Seconds in one minute (timer display). */
export const SECONDS_PER_MINUTE = 60;

/** Two-digit second pad threshold. */
export const TIMER_SECONDS_PAD = 10;
