/**
 * @file theme.types.ts
 * @layer styles
 * @description Shape of a Mergefinity visual theme token set.
 */

import type { CellValue, ThemeName } from '@/types';

/** Elevation / shadow tokens for board chrome (tiles may be flat or elevated per theme plan). */
export interface ElevationTokens {
  /** Android elevation for tiles (P-04: 2). */
  TILE_ELEVATION: number;
  /** Android elevation for the board vessel (P-04: 4). */
  BOARD_ELEVATION: number;
  /** iOS shadow color. */
  shadowColor: string;
  /** iOS shadow opacity for board chrome. */
  shadowOpacity: number;
  /** iOS shadow radius. */
  shadowRadius: number;
  /** iOS shadow offset. */
  shadowOffset: { width: number; height: number };
}

/** Full theme token contract every theme file must satisfy. */
export interface ThemeTokens {
  /** Theme identifier. */
  name: ThemeName;
  /** App / screen background. */
  SURFACE: string;
  /** Board vessel background. */
  BOARD_BG: string;
  /** Empty cell recess (also TILE_BG[0]). */
  CELL_EMPTY: string;
  /** Tile backgrounds keyed by CellValue. */
  TILE_BG: Record<CellValue, string>;
  /** Tile text colors keyed by CellValue. */
  TILE_TEXT: Record<CellValue, string>;
  /** Primary body text. */
  TEXT_PRIMARY: string;
  /** Secondary labels. */
  TEXT_SECONDARY: string;
  /** Muted captions. */
  TEXT_MUTED: string;
  /** Hairline dividers. */
  DIVIDER: string;
  /** Primary button fill. */
  BUTTON_BG: string;
  /** Primary button label. */
  BUTTON_TEXT: string;
  /** Accent (edge pulse, highlights). */
  ACCENT: string;
  /** Dimmed overlay scrim. */
  OVERLAY: string;
  /** Score badge fill. */
  SCORE_BG: string;
  /** Score badge text. */
  SCORE_TEXT: string;
  /** Elevation tokens. */
  elevation: ElevationTokens;
}
