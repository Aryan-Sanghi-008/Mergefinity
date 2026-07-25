/**
 * @file ThemeContext.tsx
 * @layer context
 * @description React context for live theme token swaps (P-04 / P-13).
 */

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Appearance } from 'react-native';

import { useSettingsStore } from '@/store/settingsStore';
import type { ThemeName } from '@/types';
import { getTheme } from '@/styles/theme';
import type { ThemeTokens } from '@/styles/theme.types';
import {
  resolveEffectiveTheme,
  type ColorSchemeName,
} from '@/utils/themeResolve';

/** Theme context value. */
export interface ThemeContextValue {
  /** Active theme name (effective tokens). */
  themeName: ThemeName;
  /** Active token set. */
  theme: ThemeTokens;
  /**
   * Apply a temporary theme (premium preview) without writing settings.
   */
  setThemeName: (name: ThemeName) => void;
  /** Clear preview and show effective theme from settings + system. */
  syncFromSettings: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export { ThemeContext };

export interface ThemeProviderProps {
  /** Tree to theme. */
  children: ReactNode;
}

function normalizeScheme(
  scheme: ReturnType<typeof Appearance.getColorScheme>,
): ColorSchemeName {
  if (scheme === 'dark' || scheme === 'light') {
    return scheme;
  }
  return null;
}

/**
 * Provides theme tokens to the tree. Swapping theme re-renders consumers.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const savedTheme = useSettingsStore((s) => s.theme);
  const followSystemDark = useSettingsStore((s) => s.followSystemDark);
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(() =>
    normalizeScheme(Appearance.getColorScheme()),
  );
  const [previewTheme, setPreviewTheme] = useState<ThemeName | null>(null);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme: next }) => {
      setColorScheme(normalizeScheme(next));
    });
    return () => sub.remove();
  }, []);

  const themeName = useMemo(
    () =>
      previewTheme ??
      resolveEffectiveTheme(savedTheme, followSystemDark, colorScheme),
    [previewTheme, savedTheme, followSystemDark, colorScheme],
  );

  const setThemeName = useCallback((name: ThemeName) => {
    setPreviewTheme(name);
  }, []);

  const syncFromSettings = useCallback(() => {
    setPreviewTheme(null);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      themeName,
      theme: getTheme(themeName),
      setThemeName,
      syncFromSettings,
    }),
    [themeName, setThemeName, syncFromSettings],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

ThemeProvider.displayName = 'ThemeProvider';
