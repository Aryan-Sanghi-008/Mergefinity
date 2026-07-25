/**
 * @file analytics.middleware.test.ts
 * @layer store/middleware
 * @description Gameplay analytics routing (P-20).
 */

import { ANALYTICS_EVENTS } from '@/constants';
import {
  logGameTerminal,
  maybeLogTileReached,
  resetSessionTilePeak,
} from '@/store/middleware/analytics.middleware';
import {
  getAnalyticsDebugEvents,
  resetAnalyticsForTests,
} from '@/utils/analytics.utils';

jest.mock('@/utils/rating.utils', () => ({
  maybeRequestReviewAfterWin: jest.fn(async () => false),
}));

describe('analytics.middleware helpers', () => {
  beforeEach(() => {
    resetAnalyticsForTests();
    resetSessionTilePeak([
      2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('emits tile_reached only when session max increases', () => {
    maybeLogTileReached(
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      'classic',
    );
    expect(getAnalyticsDebugEvents()).toHaveLength(0);

    maybeLogTileReached(
      [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      'classic',
    );
    const events = getAnalyticsDebugEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.name).toBe(ANALYTICS_EVENTS.TILE_REACHED);
  });

  it('emits win_achieved on won terminal', () => {
    logGameTerminal(
      'won',
      'classic',
      2048,
      [2048, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    );
    expect(getAnalyticsDebugEvents()[0]?.name).toBe(
      ANALYTICS_EVENTS.WIN_ACHIEVED,
    );
  });

  it('emits game_over on lost terminal', () => {
    logGameTerminal(
      'lost',
      'classic',
      100,
      [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2, 4, 8, 16, 32, 64],
    );
    expect(getAnalyticsDebugEvents()[0]?.name).toBe(ANALYTICS_EVENTS.GAME_OVER);
  });
});
