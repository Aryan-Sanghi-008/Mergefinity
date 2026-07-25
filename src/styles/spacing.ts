/**
 * @file spacing.ts
 * @layer styles
 * @description Spacing and radius tokens (P-04 plan values).
 */

/** Board / screen spacing and corner radii in dp. */
export const SPACING_TOKENS = {
  /** Inner board padding. */
  BOARD_PADDING: 12,
  /** Gap between cells. */
  TILE_GAP: 8,
  /** Screen edge padding. */
  SCREEN_PADDING: 16,
  /** Generic card radius. */
  CARD_RADIUS: 12,
  /** Tile corner radius. */
  TILE_RADIUS: 6,
  /** Board outer radius. */
  BOARD_RADIUS: 10,
  /** Button corner radius. */
  BUTTON_RADIUS: 4,
  /** Minimum interactive tap target (a11y). */
  TAP_TARGET_MIN: 44,
  /** Fallback / preview tile edge length before useBoardDimensions. */
  TILE_SIZE: 72,
  /** Global spacing scale. */
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

/** @deprecated Prefer `SPACING_TOKENS`. */
export const SPACING = {
  xs: SPACING_TOKENS.xs,
  sm: SPACING_TOKENS.sm,
  md: SPACING_TOKENS.md,
  lg: SPACING_TOKENS.lg,
  xl: SPACING_TOKENS.xl,
} as const;

/** @deprecated Prefer `SPACING_TOKENS` radii fields. */
export const RADII = {
  tile: SPACING_TOKENS.TILE_RADIUS,
  board: SPACING_TOKENS.BOARD_RADIUS,
  btn: SPACING_TOKENS.BUTTON_RADIUS,
  card: SPACING_TOKENS.CARD_RADIUS,
} as const;
