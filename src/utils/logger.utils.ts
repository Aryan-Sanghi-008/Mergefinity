/**
 * @file logger.utils.ts
 * @layer utils
 * @description __DEV__-gated logging — prefer this over bare console (P-17).
 */

type LogArgs = readonly unknown[];

function emit(
  method: 'debug' | 'info' | 'warn' | 'error',
  args: LogArgs,
): void {
  if (method === 'error') {
    // Errors always surface (including production crash triage).
    // eslint-disable-next-line no-console -- logger sink
    console.error(...args);
    return;
  }
  if (!__DEV__) {
    return;
  }
  // eslint-disable-next-line no-console -- logger sink
  console[method](...args);
}

/** Debug-level log (dev only). */
export function logDebug(...args: LogArgs): void {
  emit('debug', args);
}

/** Info-level log (dev only). */
export function logInfo(...args: LogArgs): void {
  emit('info', args);
}

/** Warn-level log (dev only). */
export function logWarn(...args: LogArgs): void {
  emit('warn', args);
}

/** Error-level log (always). */
export function logError(...args: LogArgs): void {
  emit('error', args);
}

/** Named logger API. */
export const logger = {
  debug: logDebug,
  info: logInfo,
  warn: logWarn,
  error: logError,
} as const;
