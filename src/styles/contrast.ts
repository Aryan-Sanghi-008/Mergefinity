/**
 * @file contrast.ts
 * @layer styles
 * @description WCAG relative-luminance helpers for theme QA.
 */

const HEX_RGB_LENGTH = 6;
const HEX_SHORT_LENGTH = 3;
/** WCAG 2.x sRGB linearization threshold. */
const SRGB_THRESHOLD = 0.04045;
const SRGB_DIVISOR = 12.92;
const SRGB_OFFSET = 0.055;
const SRGB_SCALE = 1.055;
const SRGB_GAMMA = 2.4;
const LUMA_R = 0.2126;
const LUMA_G = 0.7152;
const LUMA_B = 0.0722;
const CHANNEL_MAX = 255;
const WCAG_AA_NORMAL = 4.5;

/**
 * Parses `#RGB` / `#RRGGBB` into 0–1 channels. Returns null for non-hex (e.g. transparent).
 */
export function parseHexColor(
  hex: string,
): { r: number; g: number; b: number } | null {
  if (!hex.startsWith('#')) {
    return null;
  }
  let raw = hex.slice(1);
  if (raw.length === HEX_SHORT_LENGTH) {
    raw = raw
      .split('')
      .map((c) => `${c}${c}`)
      .join('');
  }
  if (raw.length !== HEX_RGB_LENGTH) {
    return null;
  }
  const value = Number.parseInt(raw, 16);
  if (Number.isNaN(value)) {
    return null;
  }
  return {
    r: ((value >> 16) & 0xff) / CHANNEL_MAX,
    g: ((value >> 8) & 0xff) / CHANNEL_MAX,
    b: (value & 0xff) / CHANNEL_MAX,
  };
}

function linearize(channel: number): number {
  return channel <= SRGB_THRESHOLD
    ? channel / SRGB_DIVISOR
    : ((channel + SRGB_OFFSET) / SRGB_SCALE) ** SRGB_GAMMA;
}

/**
 * Relative luminance per WCAG 2.x (0–1).
 */
export function relativeLuminance(hex: string): number | null {
  const rgb = parseHexColor(hex);
  if (rgb === null) {
    return null;
  }
  return (
    LUMA_R * linearize(rgb.r) + LUMA_G * linearize(rgb.g) + LUMA_B * linearize(rgb.b)
  );
}

/**
 * Contrast ratio between two hex colors (1–21). Null if either is non-hex.
 */
export function contrastRatio(foreground: string, background: string): number | null {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  if (l1 === null || l2 === null) {
    return null;
  }
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * True when contrast meets WCAG AA for normal text (≥ 4.5:1).
 */
export function meetsWcagAa(foreground: string, background: string): boolean {
  const ratio = contrastRatio(foreground, background);
  if (ratio === null) {
    return foreground === 'transparent';
  }
  return ratio >= WCAG_AA_NORMAL;
}
