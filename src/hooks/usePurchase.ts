/**
 * @file usePurchase.ts
 * @layer hooks
 * @description Purchase entitlement selectors (P-13 stub / P-16).
 */

import { usePurchaseStore } from '@/store/purchaseStore';

/**
 * @returns Whether premium themes are unlocked.
 */
export function useHasPremiumThemes(): boolean {
  return usePurchaseStore((state) => state.hasPremiumThemes);
}

/**
 * @returns Setter for premium theme entitlement.
 */
export function useSetHasPremiumThemes(): (value: boolean) => void {
  return usePurchaseStore((state) => state.setHasPremiumThemes);
}
