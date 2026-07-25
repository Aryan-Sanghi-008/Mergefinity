/**
 * @file ads.constants.ts
 * @layer constants
 * @description Ad unit IDs and IAP product IDs (P-16). Test IDs until store console is live.
 */

/** Google sample banner unit (Android) — replace with production IDs before store release. */
export const AD_UNIT_BANNER = 'ca-app-pub-3940256099942544/6300978111' as const;

/** Google sample interstitial unit (Android) — replace with production IDs before store release. */
export const AD_UNIT_INTERSTITIAL = 'ca-app-pub-3940256099942544/1033173712' as const;

/** Show interstitial every N eligible losses (after the first session game). */
export const INTERSTITIAL_EVERY_N_LOSSES = 3 as const;

/** IAP product identifiers. */
export const IAP_PRODUCT_IDS = {
  REMOVE_ADS: 'com.mergefinity.removeads',
  THEME_BUNDLE: 'com.mergefinity.themebundle',
} as const;

export type IapProductId = (typeof IAP_PRODUCT_IDS)[keyof typeof IAP_PRODUCT_IDS];

/** Stub purchase acknowledgement delay (ms). */
export const IAP_STUB_ACK_DELAY_MS = 400 as const;
