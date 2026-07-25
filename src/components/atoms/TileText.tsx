/**
 * @file TileText.tsx
 * @layer components/atoms
 * @description Space Grotesk Bold tile numeral; size from value magnitude.
 */

import { memo, useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { getTileFontSize, TYPOGRAPHY } from '@/styles';
import type { CellValue } from '@/types';

export interface TileTextProps {
  /** Tile value to display (non-zero). */
  value: Exclude<CellValue, 0>;
  /** Optional color override (defaults to theme TILE_TEXT). */
  color?: string;
}

/**
 * Renders a tile numeral with digit-aware font size.
 */
const TileText = memo(({ value, color }: TileTextProps) => {
  const { theme } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        text: {
          ...TYPOGRAPHY.tileValue,
          color: color ?? theme.TILE_TEXT[value],
          fontSize: getTileFontSize(value),
        },
      }),
    [theme, value, color],
  );

  return (
    <Text style={styles.text} allowFontScaling={false} accessibilityLabel={`${value}`}>
      {value}
    </Text>
  );
});

TileText.displayName = 'TileText';

export { TileText };
