/**
 * @file usePurchase.ts
 * @layer hooks
 * @description Purchase entitlements + stub buy/restore (P-16).
 */

import { useCallback, useState } from 'react';

import { IAP_PRODUCT_IDS } from '@/constants';
import { usePurchaseStore } from '@/store/purchaseStore';
import {
  purchase,
  restorePurchases as restorePurchasesUtil,
  type IapReceipts,
} from '@/utils/iap.utils';

/**
 * @returns Whether ads are removed.
 */
export function useHasRemovedAds(): boolean {
  return usePurchaseStore((state) => state.hasRemovedAds);
}

/**
 * @returns Whether premium themes are unlocked.
 */
export function useHasPremiumThemes(): boolean {
  return usePurchaseStore((state) => state.hasPremiumThemes);
}

/**
 * @returns Setter for premium theme entitlement (prefer purchaseThemeBundle).
 */
export function useSetHasPremiumThemes(): (value: boolean) => void {
  return usePurchaseStore((state) => state.setHasPremiumThemes);
}

export interface UsePurchaseActionsResult {
  /** True while a purchase or restore is in flight. */
  isPurchasing: boolean;
  /** Buy Remove Ads. */
  purchaseRemoveAds: () => Promise<void>;
  /** Buy theme bundle. */
  purchaseThemeBundle: () => Promise<void>;
  /** Restore from stub receipts. */
  restorePurchases: () => Promise<IapReceipts>;
}

/**
 * Purchase / restore actions with loading flag.
 */
export function usePurchaseActions(): UsePurchaseActionsResult {
  const [isPurchasing, setIsPurchasing] = useState(false);

  const run = useCallback(async (action: () => Promise<unknown>) => {
    setIsPurchasing(true);
    try {
      await action();
    } finally {
      setIsPurchasing(false);
    }
  }, []);

  const purchaseRemoveAds = useCallback(async () => {
    await run(() => purchase(IAP_PRODUCT_IDS.REMOVE_ADS));
  }, [run]);

  const purchaseThemeBundle = useCallback(async () => {
    await run(() => purchase(IAP_PRODUCT_IDS.THEME_BUNDLE));
  }, [run]);

  const restorePurchases = useCallback(async () => {
    let result: IapReceipts = { removeAds: false, themeBundle: false };
    await run(async () => {
      result = await restorePurchasesUtil();
    });
    return result;
  }, [run]);

  return {
    isPurchasing,
    purchaseRemoveAds,
    purchaseThemeBundle,
    restorePurchases,
  };
}
