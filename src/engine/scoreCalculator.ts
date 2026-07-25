/**
 * @file scoreCalculator.ts
 * @layer engine
 * @description Pure score helpers for merge events.
 */

import type { CellValue } from '@/types';

/**
 * Sums merged tile values into a score bonus.
 * @param mergedValues - Values of tiles produced by merges
 * @returns Total score points to add
 */
export function calculateMergeScore(mergedValues: readonly CellValue[]): number {
  return mergedValues.reduce<number>((sum, value) => sum + value, 0);
}

/**
 * Calculates score from a single merge value (the new tile).
 * @param mergedValue - Value of the tile created by a merge
 * @returns Score delta for that merge
 */
export function scoreFromMerge(mergedValue: CellValue): number {
  return mergedValue;
}
