/**
 * @file crashlytics.utils.ts
 * @layer utils
 * @description Stub Crashlytics client — records errors until native SDK is wired (P-20).
 */

import { logDebug, logError } from '@/utils/logger.utils';

let initialized = false;
const attributes: Record<string, string> = {};

/**
 * Initialize Crashlytics at app bootstrap (P-14 / P-20).
 */
export function initCrashlytics(): void {
  if (initialized) {
    return;
  }
  initialized = true;
  logDebug('[crashlytics] initialized (stub)');
}

/**
 * Record a non-fatal error (e.g. error boundary).
 */
export function recordCrashlyticsError(
  error: Error,
  context?: Record<string, string>,
): void {
  if (!initialized) {
    initCrashlytics();
  }
  logError('[crashlytics]', error.message, context ?? {}, attributes);
}

/**
 * Set a custom key for crash reports.
 */
export function setCrashlyticsAttribute(key: string, value: string): void {
  attributes[key] = value;
}

/**
 * Test helper — reset stub state.
 */
export function resetCrashlyticsForTests(): void {
  initialized = false;
  for (const key of Object.keys(attributes)) {
    delete attributes[key];
  }
}

/** Named Crashlytics API. */
export const Crashlytics = {
  init: initCrashlytics,
  recordError: recordCrashlyticsError,
  setAttribute: setCrashlyticsAttribute,
  resetForTests: resetCrashlyticsForTests,
} as const;
