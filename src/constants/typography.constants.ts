/**
 * @file typography.constants.ts
 * @layer constants
 * @description Font family names and type sizes (P-00 / P-04).
 */

/** Loaded font family tokens. */
export const FONT_FAMILY = {
  /** Space Grotesk Bold — tile numerals. */
  tile: 'SpaceGrotesk-Bold',
  /** Inter Regular — UI chrome. */
  ui: 'Inter-Regular',
  /** Inter Medium — UI emphasis. */
  uiMedium: 'Inter-Medium',
  /** Inter SemiBold — titles / buttons. */
  uiSemiBold: 'Inter-SemiBold',
} as const;

/** Type scale in sp/dp. */
export const FONT_SIZE = {
  scoreLabel: 10,
  score: 22,
  caption: 12,
  body: 14,
  title: 20,
  tileFiveDigit: 20,
  tileFourDigit: 24,
  tileThreeDigit: 30,
  tileTwoDigit: 36,
} as const;
