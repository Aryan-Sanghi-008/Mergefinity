/**
 * @file themeResolve.test.ts
 * @layer utils
 * @description Unit tests for effective theme resolution (P-13).
 */

import {
  isPremiumTheme,
  resolveEffectiveTheme,
  THEME_PREVIEW_MS,
} from './themeResolve';

describe('themeResolve', () => {
  it('detects premium themes', () => {
    expect(isPremiumTheme('obsidian')).toBe(true);
    expect(isPremiumTheme('ivory')).toBe(true);
    expect(isPremiumTheme('classic')).toBe(false);
    expect(isPremiumTheme('midnight')).toBe(false);
  });

  it('maps Classic + followSystemDark to Dark/Classic from OS', () => {
    expect(resolveEffectiveTheme('classic', true, 'dark')).toBe('dark');
    expect(resolveEffectiveTheme('classic', true, 'light')).toBe('classic');
  });

  it('does not override non-Classic themes when followSystemDark is on', () => {
    expect(resolveEffectiveTheme('midnight', true, 'dark')).toBe('midnight');
    expect(resolveEffectiveTheme('obsidian', true, 'light')).toBe('obsidian');
    expect(resolveEffectiveTheme('dark', true, 'light')).toBe('dark');
  });

  it('ignores system scheme when followSystemDark is off', () => {
    expect(resolveEffectiveTheme('classic', false, 'dark')).toBe('classic');
  });

  it('exports a 5s preview duration', () => {
    expect(THEME_PREVIEW_MS).toBe(5000);
  });
});
