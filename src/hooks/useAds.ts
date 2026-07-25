/**
 * @file useAds.ts
 * @layer hooks
 * @description Banner visibility for Stats / Achievements (P-16).
 */

import { useCallback, useState } from 'react';

import { useHasRemovedAds } from '@/hooks/usePurchase';
import { isBannerAllowed, isBannerAllowedSync } from '@/utils/ads.utils';

export interface UseAdsResult {
  /** Whether a banner may mount on Stats / Achievements. */
  shouldShowBanner: boolean;
  /** Ensure consent then refresh banner allowance. */
  prepareBanner: () => Promise<void>;
}

/**
 * Banner eligibility for non-game screens.
 * Call `prepareBanner` on mount (AdBanner) before the banner appears.
 */
export function useAds(): UseAdsResult {
  const hasRemovedAds = useHasRemovedAds();
  const [allowed, setAllowed] = useState(false);

  const prepareBanner = useCallback(async () => {
    if (hasRemovedAds) {
      setAllowed(false);
      return;
    }
    const ok = await isBannerAllowed();
    setAllowed(ok && isBannerAllowedSync());
  }, [hasRemovedAds]);

  return {
    shouldShowBanner: allowed && !hasRemovedAds,
    prepareBanner,
  };
}
