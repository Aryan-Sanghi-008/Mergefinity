/**
 * @file analytics.middleware.ts
 * @layer store/middleware
 * @description Analytics middleware stub (event wiring in a later phase).
 */

import type { StateCreator } from 'zustand';

/**
 * Identity middleware reserved for `tile_moved` / `game_won` / etc.
 * Kept in the persist stack per game-plan middleware order.
 */
export function analytics<T extends object>(
  config: StateCreator<T, [], []>,
): StateCreator<T, [], []> {
  return (set, get, api) => config(set, get, api);
}
