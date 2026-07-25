/**
 * @file analytics.utils.test.ts
 * @layer utils
 * @description Stub analytics buffer (P-20).
 */

import {
  getAnalyticsDebugEvents,
  initAnalytics,
  logAnalyticsEvent,
  resetAnalyticsForTests,
} from '@/utils/analytics.utils';

describe('analytics.utils', () => {
  beforeEach(() => {
    resetAnalyticsForTests();
  });

  it('buffers logged events for DebugView inspection', () => {
    initAnalytics();
    logAnalyticsEvent('game_start', { mode: 'classic' });
    logAnalyticsEvent('undo_used', { mode: 'classic' });
    const events = getAnalyticsDebugEvents();
    expect(events).toHaveLength(2);
    expect(events[0]?.name).toBe('game_start');
    expect(events[1]?.name).toBe('undo_used');
  });
});
