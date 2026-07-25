/**
 * @file useTheme.ts
 * @layer hooks
 * @description Access the active theme tokens and setter.
 */

import { useContext } from 'react';

import {
  ThemeContext,
  type ThemeContextValue,
} from '@/context/ThemeContext';

/**
 * Returns the active theme context.
 * @throws If used outside `ThemeProvider`
 */
export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (value === null) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return value;
}
