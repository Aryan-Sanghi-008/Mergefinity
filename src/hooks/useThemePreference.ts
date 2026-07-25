/**
 * @file useThemePreference.ts
 * @layer hooks
 * @description Theme selection, system-dark follow, and premium preview (P-13).
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import { useHasPremiumThemes, useSetHasPremiumThemes } from '@/hooks/usePurchase';
import { useTheme } from '@/hooks/useTheme';
import { useSettingsStore } from '@/store/settingsStore';
import type { ThemeName } from '@/types';
import { isPremiumTheme, THEME_PREVIEW_MS } from '@/utils/themeResolve';

export interface UseThemePreferenceResult {
  /** Persisted theme preference. */
  savedTheme: ThemeName;
  /** Effective context theme name. */
  activeThemeName: ThemeName;
  /** Whether Classic follows OS dark mode. */
  followSystemDark: boolean;
  /** Premium bundle unlocked. */
  hasPremiumThemes: boolean;
  /** Theme awaiting purchase after preview. */
  pendingPurchaseTheme: ThemeName | null;
  /** Purchase sheet visibility. */
  purchaseSheetVisible: boolean;
  /** True while a premium preview timer is running. */
  isPreviewing: boolean;
  /** Persist + apply a selectable theme (or start premium preview). */
  selectTheme: (name: ThemeName) => void;
  /** Toggle system dark follow (Classic only semantics). */
  setFollowSystemDark: (enabled: boolean) => void;
  /** Confirm stub purchase and apply pending theme. */
  confirmPurchase: () => void;
  /** Dismiss purchase sheet without buying. */
  cancelPurchase: () => void;
}

/**
 * Wires settings + purchase + ThemeContext for the picker and settings.
 */
export function useThemePreference(): UseThemePreferenceResult {
  const { themeName: activeThemeName, setThemeName, syncFromSettings } = useTheme();
  const savedTheme = useSettingsStore((s) => s.theme);
  const followSystemDark = useSettingsStore((s) => s.followSystemDark);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const setFollowSystemDarkAction = useSettingsStore((s) => s.setFollowSystemDark);
  const hasPremiumThemes = useHasPremiumThemes();
  const setHasPremiumThemes = useSetHasPremiumThemes();

  const [pendingPurchaseTheme, setPendingPurchaseTheme] = useState<ThemeName | null>(
    null,
  );
  const [purchaseSheetVisible, setPurchaseSheetVisible] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const previewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPreviewTimer = useCallback(() => {
    if (previewTimerRef.current !== null) {
      clearTimeout(previewTimerRef.current);
      previewTimerRef.current = null;
    }
    setIsPreviewing(false);
  }, []);

  useEffect(() => {
    return () => {
      if (previewTimerRef.current !== null) {
        clearTimeout(previewTimerRef.current);
      }
    };
  }, []);

  const applyPersisted = useCallback(
    (name: ThemeName) => {
      clearPreviewTimer();
      setTheme(name);
      syncFromSettings();
    },
    [clearPreviewTimer, setTheme, syncFromSettings],
  );

  const beginPremiumPreview = useCallback(
    (name: ThemeName) => {
      clearPreviewTimer();
      setIsPreviewing(true);
      setThemeName(name);
      previewTimerRef.current = setTimeout(() => {
        previewTimerRef.current = null;
        setIsPreviewing(false);
        syncFromSettings();
        setPendingPurchaseTheme(name);
        setPurchaseSheetVisible(true);
      }, THEME_PREVIEW_MS);
    },
    [clearPreviewTimer, setThemeName, syncFromSettings],
  );

  const selectTheme = useCallback(
    (name: ThemeName) => {
      if (isPremiumTheme(name) && !hasPremiumThemes) {
        beginPremiumPreview(name);
        return;
      }
      applyPersisted(name);
    },
    [hasPremiumThemes, beginPremiumPreview, applyPersisted],
  );

  const setFollowSystemDark = useCallback(
    (enabled: boolean) => {
      clearPreviewTimer();
      setFollowSystemDarkAction(enabled);
      syncFromSettings();
    },
    [clearPreviewTimer, setFollowSystemDarkAction, syncFromSettings],
  );

  const confirmPurchase = useCallback(() => {
    setHasPremiumThemes(true);
    setPurchaseSheetVisible(false);
    const pending = pendingPurchaseTheme;
    setPendingPurchaseTheme(null);
    if (pending !== null) {
      applyPersisted(pending);
    }
  }, [setHasPremiumThemes, pendingPurchaseTheme, applyPersisted]);

  const cancelPurchase = useCallback(() => {
    setPurchaseSheetVisible(false);
    setPendingPurchaseTheme(null);
    syncFromSettings();
  }, [syncFromSettings]);

  return {
    savedTheme,
    activeThemeName,
    followSystemDark,
    hasPremiumThemes,
    pendingPurchaseTheme,
    purchaseSheetVisible,
    isPreviewing,
    selectTheme,
    setFollowSystemDark,
    confirmPurchase,
    cancelPurchase,
  };
}
