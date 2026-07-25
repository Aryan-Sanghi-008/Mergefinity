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
  /** Hairline divider thickness. */
  DIVIDER_THICKNESS: 0.5,
  /** Icon glyph box inside IconButton. */
  ICON_GLYPH_SIZE: 20,
  /** Theme preview mini-tile size. */
  THEME_PREVIEW_TILE: 28,
  /** Icon geometry ratios (multiplied by glyph size). */
  ICON_RING_RATIO: 0.7,
  ICON_CHEVRON_RATIO: 0.35,
  ICON_CHECK_W: 0.45,
  ICON_CHECK_H: 0.25,
  ICON_LOCK_BODY_W: 0.55,
  ICON_LOCK_BODY_H: 0.4,
  ICON_LOCK_SHACKLE_W: 0.35,
  ICON_LOCK_SHACKLE_H: 0.3,
  ICON_DOT_RATIO: 0.45,
  ICON_GRID_RATIO: 0.75,
  ICON_GRID_CELL_RATIO: 0.3,
  ICON_THICKNESS_DIVISOR: 10,
  ICON_MIN_THICKNESS: 2,
  ICON_BAR_SHORT_RATIO: 0.6,
  ICON_BAR_MID_RATIO: 0.85,
  /** Muted glyph / preview opacity. */
  OPACITY_MUTED: 0.85,
  OPACITY_DISABLED: 0.45,
  /** Common layout multipliers (avoids magic numbers in components). */
  LAYOUT_DOUBLE: 2,
  LAYOUT_TRIPLE: 3,
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
