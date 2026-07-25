/**
 * @file delay.ts
 * @layer utils
 * @description Promise-based delay for animation phase sequencing.
 */

/**
 * Resolves after `ms` milliseconds (0 resolves on next microtask).
 */
export function delay(ms: number): Promise<void> {
  if (ms <= 0) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
