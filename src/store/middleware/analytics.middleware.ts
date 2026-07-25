/**
 * @file analytics.middleware.ts
 * @layer store/middleware
 * @description Emits P-20 analytics events from store actions (never from UI).
 */

import type { StateCreator } from 'zustand';

import { ANALYTICS_EVENTS } from '@/constants/analytics.constants';
import type {
  CommitMovePayload,
  GameStore,
  SettingsStore,
  ThemeName,
} from '@/types';
import { logAnalyticsEvent } from '@/utils/analytics.utils';
import { maybeRequestReviewAfterWin } from '@/utils/rating.utils';
import { maxBoardTile } from '@/utils/statsHelpers';

/** Highest tile seen this session (for `tile_reached`). */
let sessionMaxTile = 0;

/**
 * Reset the per-session tile peak (new game).
 */
export function resetSessionTilePeak(board: GameStore['board']): void {
  sessionMaxTile = maxBoardTile(board);
}

/**
 * Emit `tile_reached` when a new session maximum appears.
 */
export function maybeLogTileReached(
  board: GameStore['board'],
  mode: GameStore['mode'],
): void {
  const peak = maxBoardTile(board);
  if (peak <= sessionMaxTile) {
    return;
  }
  sessionMaxTile = peak;
  logAnalyticsEvent(ANALYTICS_EVENTS.TILE_REACHED, {
    tile_value: peak,
    mode,
  });
}

/**
 * Emit terminal game analytics + rating prompt on win.
 */
export function logGameTerminal(
  status: GameStore['status'],
  mode: GameStore['mode'],
  score: number,
  board: GameStore['board'],
): void {
  const bestTile = maxBoardTile(board);
  if (status === 'won') {
    logAnalyticsEvent(ANALYTICS_EVENTS.WIN_ACHIEVED, {
      mode,
      score,
      best_tile: bestTile,
    });
    void maybeRequestReviewAfterWin();
    return;
  }
  if (status === 'lost') {
    logAnalyticsEvent(ANALYTICS_EVENTS.GAME_OVER, {
      mode,
      score,
      best_tile: bestTile,
    });
  }
}

/**
 * Identity middleware — keeps middleware stack order; specialized wrappers below.
 */
export function analytics<T extends object>(
  config: StateCreator<T, [], []>,
): StateCreator<T, [], []> {
  return (set, get, api) => config(set, get, api);
}

/**
 * Wraps game store actions with P-20 gameplay analytics.
 */
export function analyticsGame<T extends GameStore>(
  config: StateCreator<T, [], []>,
): StateCreator<T, [], []> {
  return (set, get, api) => {
    const store = config(set, get, api);
    const commitMove = store.commitMove.bind(store);
    const undo = store.undo.bind(store);
    const restart = store.restart.bind(store);
    const setMode = store.setMode.bind(store);
    const expireTimer = store.expireTimer.bind(store);

    resetSessionTilePeak(store.board);

    store.commitMove = (payload: CommitMovePayload) => {
      const beforeStatus = get().status;
      commitMove(payload);
      const next = get();
      maybeLogTileReached(next.board, next.mode);
      if (beforeStatus !== 'won' && next.status === 'won') {
        logGameTerminal('won', next.mode, next.score, next.board);
      } else if (beforeStatus !== 'lost' && next.status === 'lost') {
        logGameTerminal('lost', next.mode, next.score, next.board);
      }
    };

    store.undo = () => {
      const before = get().undosUsed;
      undo();
      if (get().undosUsed > before) {
        logAnalyticsEvent(ANALYTICS_EVENTS.UNDO_USED, { mode: get().mode });
      }
    };

    store.restart = () => {
      restart();
      const next = get();
      resetSessionTilePeak(next.board);
      logAnalyticsEvent(ANALYTICS_EVENTS.GAME_START, { mode: next.mode });
    };

    store.setMode = (mode) => {
      setMode(mode);
      const next = get();
      resetSessionTilePeak(next.board);
      logAnalyticsEvent(ANALYTICS_EVENTS.GAME_START, { mode: next.mode });
    };

    store.expireTimer = () => {
      const beforeStatus = get().status;
      expireTimer();
      const next = get();
      if (beforeStatus !== 'won' && next.status === 'won') {
        logGameTerminal('won', next.mode, next.score, next.board);
      }
    };

    return store;
  };
}

/**
 * Wraps settings theme changes with `theme_changed`.
 */
export function analyticsSettings<T extends SettingsStore>(
  config: StateCreator<T, [], []>,
): StateCreator<T, [], []> {
  return (set, get, api) => {
    const store = config(set, get, api);
    const setTheme = store.setTheme.bind(store);

    store.setTheme = (theme: ThemeName) => {
      const prev = get().theme;
      setTheme(theme);
      if (get().theme !== prev) {
        logAnalyticsEvent(ANALYTICS_EVENTS.THEME_CHANGED, { theme });
      }
    };

    return store;
  };
}
