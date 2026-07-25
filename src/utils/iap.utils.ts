/**
 * @file iap.utils.ts
 * @layer utils
 * @description Stub IAP purchase / restore / sync (P-16). Optimistic entitlements.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  IAP_PRODUCT_IDS,
  IAP_STUB_ACK_DELAY_MS,
  STORAGE_KEYS,
  type IapProductId,
} from '@/constants';
import { usePurchaseStore } from '@/store/purchaseStore';

/** Persisted stub receipt map (survives force-close after optimistic grant). */
export interface IapReceipts {
  removeAds: boolean;
  themeBundle: boolean;
}

async function readReceipts(): Promise<IapReceipts> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.IAP_RECEIPTS);
    if (raw === null) {
      return { removeAds: false, themeBundle: false };
    }
    const parsed = JSON.parse(raw) as Partial<IapReceipts>;
    return {
      removeAds: parsed.removeAds === true,
      themeBundle: parsed.themeBundle === true,
    };
  } catch {
    return { removeAds: false, themeBundle: false };
  }
}

async function writeReceipts(receipts: IapReceipts): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.IAP_RECEIPTS, JSON.stringify(receipts));
}

function applyReceiptsToStore(receipts: IapReceipts): void {
  const store = usePurchaseStore.getState();
  store.setHasRemovedAds(receipts.removeAds);
  store.setHasPremiumThemes(receipts.themeBundle);
}

/**
 * Purchase a product. Grants entitlement immediately (persist), then stub-acks.
 */
export async function purchase(productId: IapProductId): Promise<void> {
  if (productId === IAP_PRODUCT_IDS.REMOVE_ADS) {
    usePurchaseStore.getState().setHasRemovedAds(true);
  } else if (productId === IAP_PRODUCT_IDS.THEME_BUNDLE) {
    usePurchaseStore.getState().setHasPremiumThemes(true);
  }

  const receipts = await readReceipts();
  if (productId === IAP_PRODUCT_IDS.REMOVE_ADS) {
    receipts.removeAds = true;
  } else if (productId === IAP_PRODUCT_IDS.THEME_BUNDLE) {
    receipts.themeBundle = true;
  }
  await writeReceipts(receipts);
  await new Promise<void>((resolve) => {
    setTimeout(resolve, IAP_STUB_ACK_DELAY_MS);
  });
}

/**
 * Re-query stub receipts and update purchaseStore.
 */
export async function restorePurchases(): Promise<IapReceipts> {
  const receipts = await readReceipts();
  const state = usePurchaseStore.getState();
  const merged: IapReceipts = {
    removeAds: receipts.removeAds || state.hasRemovedAds,
    themeBundle: receipts.themeBundle || state.hasPremiumThemes,
  };
  await writeReceipts(merged);
  applyReceiptsToStore(merged);
  return merged;
}

/**
 * Foreground sync — same as restore for the stub store.
 */
export async function syncPurchases(): Promise<IapReceipts> {
  return restorePurchases();
}
