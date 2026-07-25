/**
 * @file ThemeContext.tsx
 * @layer context
 * @description React context for live theme token swaps (P-04 / P-13).
 */

import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { ThemeName } from '@/types';
import { DEFAULT_THEME_NAME, getTheme } from '@/styles/theme';
import type { ThemeTokens } from '@/styles/theme.types';

/** Theme context value. */
export interface ThemeContextValue {
  /** Active theme name. */
  themeName: ThemeName;
  /** Active token set. */
  theme: ThemeTokens;
  /** Swap the active theme synchronously. */
  setThemeName: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export { ThemeContext };

export interface ThemeProviderProps {
  /** Tree to theme. */
  children: ReactNode;
  /** Optional initial theme (defaults to classic). */
  initialThemeName?: ThemeName;
}

/**
 * Provides theme tokens to the tree. Swapping `themeName` re-renders consumers.
 */
export function ThemeProvider({
  children,
  initialThemeName = DEFAULT_THEME_NAME,
}: ThemeProviderProps) {
  const [themeName, setThemeNameState] = useState<ThemeName>(initialThemeName);

  const setThemeName = useCallback((name: ThemeName) => {
    setThemeNameState(name);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      themeName,
      theme: getTheme(themeName),
      setThemeName,
    }),
    [themeName, setThemeName],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

ThemeProvider.displayName = 'ThemeProvider';
