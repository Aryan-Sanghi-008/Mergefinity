/**
 * @file analytics.utils.ts
 * @layer utils
 * @description Stub Firebase Analytics client — buffers events for DebugView (P-20).
 */

import { ANALYTICS_EVENTS } from '@/constants/analytics.constants';
import type {
  AnalyticsDebugEvent,
  AnalyticsEventName,
  AnalyticsParams,
} from '@/types';
import { logDebug } from '@/utils/logger.utils';

const DEBUG_BUFFER_CAP = 100;

let debugBuffer: AnalyticsDebugEvent[] = [];
let initialized = false;

/**
 * Initialize analytics (no-op until real Firebase config is present).
 */
export function initAnalytics(): void {
  if (initialized) {
    return;
  }
  initialized = true;
  logDebug('[analytics] initialized (stub)');
}

/**
 * Log a named analytics event with optional params.
 */
export function logAnalyticsEvent(
  name: AnalyticsEventName,
  params?: AnalyticsParams,
): void {
  if (!initialized) {
    initAnalytics();
  }
  const entry: AnalyticsDebugEvent = {
    name,
    ...(params !== undefined ? { params } : {}),
    at: Date.now(),
  };
  debugBuffer = [...debugBuffer, entry].slice(-DEBUG_BUFFER_CAP);
  logDebug('[analytics]', name, params ?? {});
}

/**
 * @returns Recent events for DebugView verification / tests.
 */
export function getAnalyticsDebugEvents(): readonly AnalyticsDebugEvent[] {
  return debugBuffer;
}

/**
 * Test helper — clear buffered events and init flag.
 */
export function resetAnalyticsForTests(): void {
  debugBuffer = [];
  initialized = false;
}

/** Convenience wrappers matching the P-20 event table. */
export const Analytics = {
  init: initAnalytics,
  logEvent: logAnalyticsEvent,
  getDebugEvents: getAnalyticsDebugEvents,
  resetForTests: resetAnalyticsForTests,
  events: ANALYTICS_EVENTS,
} as const;
