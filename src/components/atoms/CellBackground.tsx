/**
 * @file CellBackground.tsx
 * @layer components/atoms
 * @description Empty board cell using theme CELL_EMPTY and board dimensions.
 */

import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { STRINGS } from '@/constants';
import { useBoardDimensions } from '@/hooks/useBoardDimensions';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS } from '@/styles';

export interface CellBackgroundProps {
  /** Optional override for tile edge (defaults to useBoardDimensions). */
  size?: number;
}

/**
 * Renders an empty cell recess for the board grid.
 */
const CellBackground = memo(({ size }: CellBackgroundProps) => {
  const { theme } = useTheme();
  const { tileSize } = useBoardDimensions();
  const edge = size ?? tileSize;
  const styles = useMemo(
    () =>
      StyleSheet.create({
        cell: {
          width: edge,
          height: edge,
          borderRadius: SPACING_TOKENS.TILE_RADIUS,
          backgroundColor: theme.CELL_EMPTY,
        },
      }),
    [theme.CELL_EMPTY, edge],
  );

  return (
    <View
      style={styles.cell}
      accessibilityLabel={STRINGS.A11Y_EMPTY_CELL}
      importantForAccessibility="no"
    />
  );
});

CellBackground.displayName = 'CellBackground';

export { CellBackground };
