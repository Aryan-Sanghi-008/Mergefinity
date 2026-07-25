/**
 * @file iap.utils.test.ts
 * @layer utils
 * @description Optimistic IAP entitlement grants (P-16).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { IAP_PRODUCT_IDS, STORAGE_KEYS } from '@/constants';
import { usePurchaseStore } from '@/store/purchaseStore';
import { purchase, restorePurchases } from '@/utils/iap.utils';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual(
    '@react-native-async-storage/async-storage/jest/async-storage-mock',
  ),
);

describe('iap.utils', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    usePurchaseStore.setState({
      hasRemovedAds: false,
      hasPremiumThemes: false,
    });
  });

  it('grants Remove Ads entitlement before stub ack completes', async () => {
    const pending = purchase(IAP_PRODUCT_IDS.REMOVE_ADS);
    expect(usePurchaseStore.getState().hasRemovedAds).toBe(true);
    await pending;
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.IAP_RECEIPTS);
    expect(raw).toContain('"removeAds":true');
  });

  it('restores theme bundle from receipts', async () => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.IAP_RECEIPTS,
      JSON.stringify({ removeAds: false, themeBundle: true }),
    );
    const receipts = await restorePurchases();
    expect(receipts.themeBundle).toBe(true);
    expect(usePurchaseStore.getState().hasPremiumThemes).toBe(true);
  });
});
