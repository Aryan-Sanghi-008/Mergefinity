/**
 * @file ThemePreviewTile.tsx
 * @layer components/molecules
 * @description 2×2 mini board preview for a theme.
 */

import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  getTheme,
  getTileFontSize,
  SPACING_TOKENS,
  THEME_PREVIEW_VALUES,
  TYPOGRAPHY,
} from '@/styles';
import type { ThemeName } from '@/types';

const CELL_A = THEME_PREVIEW_VALUES[0]!;
const CELL_B = THEME_PREVIEW_VALUES[1]!;
const CELL_C = THEME_PREVIEW_VALUES[2]!;
const CELL_D = THEME_PREVIEW_VALUES[3]!;

export interface ThemePreviewTileProps {
  /** Theme whose tile colors to preview. */
  themeName: ThemeName;
}

/**
 * Compact 2×2 preview — reads tokens via `getTheme` (not active theme context).
 */
const ThemePreviewTile = memo(({ themeName }: ThemePreviewTileProps) => {
  const tokens = getTheme(themeName);
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  return (
    <View style={styles.board} accessibilityLabel={`${themeName} theme preview`}>
      <View style={styles.tileA}>
        <Text style={styles.textA} allowFontScaling={false}>
          {CELL_A}
        </Text>
      </View>
      <View style={styles.tileB}>
        <Text style={styles.textB} allowFontScaling={false}>
          {CELL_B}
        </Text>
      </View>
      <View style={styles.tileC}>
        <Text style={styles.textC} allowFontScaling={false}>
          {CELL_C}
        </Text>
      </View>
      <View style={styles.tileD}>
        <Text style={styles.textD} allowFontScaling={false}>
          {CELL_D}
        </Text>
      </View>
    </View>
  );
});

ThemePreviewTile.displayName = 'ThemePreviewTile';

function createStyles(tokens: ReturnType<typeof getTheme>) {
  const edge = SPACING_TOKENS.THEME_PREVIEW_TILE;
  const tileBase = {
    width: edge,
    height: edge,
    borderRadius: SPACING_TOKENS.TILE_RADIUS,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };
  const textBase = {
    ...TYPOGRAPHY.tileValue,
  };

  return StyleSheet.create({
    board: {
      width: edge * SPACING_TOKENS.LAYOUT_DOUBLE + SPACING_TOKENS.TILE_GAP,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING_TOKENS.TILE_GAP,
      padding: SPACING_TOKENS.xs,
      borderRadius: SPACING_TOKENS.BUTTON_RADIUS,
      backgroundColor: tokens.BOARD_BG,
    },
    tileA: { ...tileBase, backgroundColor: tokens.TILE_BG[CELL_A] },
    tileB: { ...tileBase, backgroundColor: tokens.TILE_BG[CELL_B] },
    tileC: { ...tileBase, backgroundColor: tokens.TILE_BG[CELL_C] },
    tileD: { ...tileBase, backgroundColor: tokens.TILE_BG[CELL_D] },
    textA: {
      ...textBase,
      color: tokens.TILE_TEXT[CELL_A],
      fontSize: getTileFontSize(CELL_A),
    },
    textB: {
      ...textBase,
      color: tokens.TILE_TEXT[CELL_B],
      fontSize: getTileFontSize(CELL_B),
    },
    textC: {
      ...textBase,
      color: tokens.TILE_TEXT[CELL_C],
      fontSize: getTileFontSize(CELL_C),
    },
    textD: {
      ...textBase,
      color: tokens.TILE_TEXT[CELL_D],
      fontSize: getTileFontSize(CELL_D),
    },
  });
}

export { ThemePreviewTile };
