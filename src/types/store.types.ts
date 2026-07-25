/**
 * @file store.types.ts
 * @layer types
 * @description Zustand store state and action contracts.
 */

import type { Board, CellValue, GameMode, GameSnapshot, ThemeName } from './game.types';
import type { AchievementId, AchievementProgress } from './achievement.types';
import type {
  GameStats,
  LifetimeStats,
  RecordGameEndPayload,
  SessionRecord,
} from './stats.types';

/**
 * Finite game status machine.
 * `animating` blocks new input until slide/merge/spawn completes.
 */
export type GameStatus = 'idle' | 'playing' | 'won' | 'lost' | 'animating';

/** Persisted and ephemeral game state fields. */
export interface GameState {
  /** Current board. */
  board: Board;
  /** Current score. */
  score: number;
  /** Best score for the active mode (persisted). */
  bestScore: number;
  /** Lifecycle status. */
  status: GameStatus;
  /** Undo stack (newest last), capped at MAX_UNDO_HISTORY. */
  history: GameSnapshot[];
  /** Active play mode (`activeMode` in the game plan). */
  mode: GameMode;
  /** Undos remaining this game (mode / IAP dependent). */
  undosRemaining: number;
  /** Moves completed this game (for snapshots). */
  moveCount: number;
  /** Player chose Keep Going after tile win. */
  continuedAfterWin: boolean;
  /** True while slide/merge/spawn runs (mirrored to SharedValue for gestures). */
  animationLock: boolean;
  /** Remaining Time Attack ms; `null` when mode has no timer. */
  timerRemainingMs: number | null;
  /** Epoch ms when the current session started (for duration stats). */
  sessionStartedAt: number;
  /** True after this session has been written to statsStore. */
  statsRecorded: boolean;
  /** Undos performed this session (for Purist). */
  undosUsed: number;
}

/** Payload after animated slide→merge→spawn completes. */
export interface CommitMovePayload {
  /** Board after spawn. */
  board: Board;
  /** Points added this move. */
  scoreDelta: number;
  /** Post-merge tile values created this move (one per merge). */
  mergeValues: CellValue[];
}

/** Imperative store actions. */
export interface GameActions {
  /** Apply a successful move after animation (history + score + win/lose). */
  commitMove: (payload: CommitMovePayload) => void;
  /** Restore the previous snapshot when undos remain. */
  undo: () => void;
  /** Start a fresh game in the current mode (keeps bestScore). */
  restart: () => void;
  /** Dismiss win overlay and continue past 2048. */
  continueAfterWin: () => void;
  /** Switch mode (soft-restarts board). */
  setMode: (mode: GameMode) => void;
  /** Sync animation lock for gestures / status. */
  setAnimationLock: (locked: boolean) => void;
  /** Tick / set Time Attack remaining ms. */
  setTimerRemainingMs: (ms: number | null) => void;
  /** End Time Attack when countdown hits zero (status won). */
  expireTimer: () => void;
}

/** Combined Zustand game store shape. */
export type GameStore = GameState & GameActions;

/** Settings slice (persisted). */
export interface SettingsState {
  /** Active visual theme name. */
  theme: ThemeName;
  /** Whether haptic feedback is enabled. */
  hapticsEnabled: boolean;
  /** Whether sound effects are enabled. */
  soundEnabled: boolean;
  /** Board cells per axis (Classic default 4). */
  boardSize: number;
}

/** Settings store actions. */
export interface SettingsActions {
  /** Toggle or set haptics. */
  setHapticsEnabled: (enabled: boolean) => void;
  /** Toggle or set sound. */
  setSoundEnabled: (enabled: boolean) => void;
  /** Set theme preference (UI may still use ThemeContext until P-13). */
  setTheme: (theme: ThemeName) => void;
  /** Set board size preference. */
  setBoardSize: (boardSize: number) => void;
}

/** Combined settings Zustand store. */
export type SettingsStore = SettingsState & SettingsActions;

/** Stats store state. */
export interface StatsState {
  /** Per-mode aggregates. */
  byMode: Record<GameMode, GameStats>;
  /** Cross-mode lifetime aggregates. */
  lifetime: LifetimeStats;
  /** Recent sessions (newest last, max 10). */
  sessionHistory: SessionRecord[];
}

/** Stats store actions (wired richly in P-11). */
export interface StatsActions {
  /** Replace session history (capped). */
  setSessionHistory: (sessions: SessionRecord[]) => void;
  /** Reset counts/history/streaks; preserves best scores and best tiles. */
  resetStats: () => void;
  /** Raise per-mode best score when `score` is higher. */
  recordBestScore: (mode: GameMode, score: number) => void;
  /** Read best score for a mode. */
  getBestScore: (mode: GameMode) => number;
  /** Accumulate merge events into histogram + per-mode totals. */
  recordMerges: (mode: GameMode, values: readonly CellValue[]) => void;
  /** Record a terminal win/loss once per session. */
  recordGameEnd: (payload: RecordGameEndPayload) => void;
  /** Replace modesWon flags (achievement exploration). */
  setModesWon: (modesWon: Record<GameMode, boolean>) => void;
}

/** Combined stats store. */
export type StatsStore = StatsState & StatsActions;

/** Achievement unlock map. */
export interface AchievementState {
  /** Progress / unlock state per achievement id. */
  progress: Record<AchievementId, AchievementProgress>;
}

/** Achievement store actions (P-12). */
export interface AchievementActions {
  /** Mark an achievement unlocked (idempotent). */
  unlock: (id: AchievementId) => void;
  /** Unlock many ids (idempotent). */
  unlockMany: (ids: readonly AchievementId[]) => void;
  /** Reset all to locked. */
  resetAchievements: () => void;
}

/** Combined achievement store. */
export type AchievementStore = AchievementState & AchievementActions;

/** IAP entitlements. */
export interface PurchaseState {
  /** Ads removed. */
  hasRemovedAds: boolean;
  /** Premium theme pack owned. */
  hasPremiumThemes: boolean;
}

/** Purchase store actions (P-16). */
export interface PurchaseActions {
  /** Set ad-removal entitlement. */
  setHasRemovedAds: (value: boolean) => void;
  /** Set premium themes entitlement. */
  setHasPremiumThemes: (value: boolean) => void;
}

/** Combined purchase store. */
export type PurchaseStore = PurchaseState & PurchaseActions;
