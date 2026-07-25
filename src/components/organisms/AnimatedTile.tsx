/**
 * @file AnimatedTile.tsx
 * @layer components/organisms
 * @description Absolutely positioned tile shell; motion shared values arrive in P-07.
 */

import { memo, useMemo } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { TileView } from '@/components/atoms';
import type { CellValue } from '@/types';

export interface AnimatedTileProps {
  /** Stable identity for React keys / future Reanimated shared values. */
  tileId: string;
  /** Tile face value (non-zero). */
  value: CellValue;
  /** Absolute left within the board. */
  left: number;
  /** Absolute top within the board. */
  top: number;
  /** Tile edge length. */
  size: number;
  /** Optional Reanimated style (translate/scale/opacity). */
  animatedStyle?: StyleProp<ViewStyle>;
}

/**
 * Thin static wrapper over `TileView` with absolute board placement.
 * P-07 wires `useAnimatedTile` into `animatedStyle` without changing this API.
 */
const AnimatedTile = memo(
  ({ tileId, value, left, top, size, animatedStyle }: AnimatedTileProps) => {
    const styles = useMemo(
      () =>
        StyleSheet.create({
          position: {
            position: 'absolute',
            left,
            top,
          },
        }),
      [left, top],
    );

    return (
      <View style={styles.position} testID={tileId} importantForAccessibility="no">
        <TileView value={value} size={size} animatedStyle={animatedStyle} />
      </View>
    );
  },
);

AnimatedTile.displayName = 'AnimatedTile';

export { AnimatedTile };
