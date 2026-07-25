/**
 * @file analytics.types.ts
 * @layer types
 * @description Analytics event parameter shapes (P-20).
 */

import type { CellValue, GameMode, ThemeName } from './game.types';

/** Canonical analytics event names (P-20). */
export type AnalyticsEventName =
  | 'game_start'
  | 'game_over'
  | 'win_achieved'
  | 'tile_reached'
  | 'undo_used'
  | 'theme_changed'
  | 'iap_initiated'
  | 'iap_completed';

/** Primitive values allowed on analytics event params. */
export type AnalyticsParamValue = string | number | boolean;

/** Event parameter map. */
export type AnalyticsParams = Readonly<Record<string, AnalyticsParamValue>>;

/** One buffered debug event (stub DebugView). */
export interface AnalyticsDebugEvent {
  /** Event name. */
  name: AnalyticsEventName;
  /** Optional parameters. */
  params?: AnalyticsParams;
  /** Epoch ms when logged. */
  at: number;
}

/** Params for `game_start`. */
export interface GameStartParams extends AnalyticsParams {
  mode: GameMode;
}

/** Params for `game_over` / `win_achieved`. */
export interface GameEndAnalyticsParams extends AnalyticsParams {
  mode: GameMode;
  score: number;
  best_tile: CellValue;
}

/** Params for `tile_reached`. */
export interface TileReachedParams extends AnalyticsParams {
  tile_value: CellValue;
  mode: GameMode;
}

/** Params for `theme_changed`. */
export interface ThemeChangedParams extends AnalyticsParams {
  theme: ThemeName;
}

/** Params for IAP events. */
export interface IapAnalyticsParams extends AnalyticsParams {
  product_id: string;
}
