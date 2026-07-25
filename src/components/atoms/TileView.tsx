/**
 * @file TileView.tsx
 * @layer components/atoms
 * @description Colored tile surface + numeral; accepts Reanimated animatedStyle.
 */

import { memo, useMemo } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { useTheme } from '@/hooks/useTheme';
import { getTileFontSize, SPACING_TOKENS, TYPOGRAPHY } from '@/styles';
import type { CellValue } from '@/types';

export interface TileViewProps {
  /** Tile value (0 renders empty-looking cell fill only). */
  value: CellValue;
  /** Edge length in dp. */
  size: number;
  /** Optional Reanimated style (translate/scale/opacity). */
  animatedStyle?: StyleProp<ViewStyle>;
}

/**
 * Renders a single board tile. Theme colors come from tokens — no theme branching.
 */
const TileView = memo(({ value, size, animatedStyle }: TileViewProps) => {
  const { theme } = useTheme();
  const styles = useMemo(
    () => createStyles(theme.TILE_BG[value], theme.TILE_TEXT[value], size, value),
    [theme, value, size],
  );

  const body = (
    <View style={styles.tile}>
      {value !== 0 ? (
        <Text style={styles.text} allowFontScaling={false}>
          {value}
        </Text>
      ) : null}
    </View>
  );

  if (animatedStyle) {
    return <Animated.View style={animatedStyle}>{body}</Animated.View>;
  }

  return body;
});

TileView.displayName = 'TileView';

function createStyles(
  backgroundColor: string,
  color: string,
  size: number,
  value: CellValue,
) {
  return StyleSheet.create({
    tile: {
      width: size,
      height: size,
      borderRadius: SPACING_TOKENS.TILE_RADIUS,
      backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 0,
    },
    text: {
      ...TYPOGRAPHY.tileValue,
      color,
      fontSize: getTileFontSize(value),
    },
  });
}

export { TileView };
