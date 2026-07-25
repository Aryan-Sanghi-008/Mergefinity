/**
 * @file AnimatedTile.tsx
 * @layer components/organisms
 * @description Absolutely positioned tile with Reanimated slide/merge/spawn.
 */

import { memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { TileView } from '@/components/atoms';
import { useAnimatedTile } from '@/hooks/useAnimatedTile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { CellValue, TileMotionPhase } from '@/types';

export interface AnimatedTileProps {
  /** Stable identity for React keys / shared values. */
  tileId: string;
  /** Tile face value (non-zero). */
  value: CellValue;
  /** Absolute left of destination cell. */
  left: number;
  /** Absolute top of destination cell. */
  top: number;
  /** Absolute left of source cell (slide start). */
  fromLeft: number;
  /** Absolute top of source cell (slide start). */
  fromTop: number;
  /** Tile edge length. */
  size: number;
  /** Current motion phase. */
  phase: TileMotionPhase;
  /** Sequence bump to retrigger animations. */
  motionSeq: number;
}

/**
 * Board tile shell — layout at destination; translates from source via shared values.
 */
const AnimatedTile = memo(
  ({
    tileId,
    value,
    left,
    top,
    fromLeft,
    fromTop,
    size,
    phase,
    motionSeq,
  }: AnimatedTileProps) => {
    const reducedMotion = useReducedMotion();
    const { animatedStyle } = useAnimatedTile({
      left,
      top,
      fromLeft,
      fromTop,
      phase,
      motionSeq,
      reducedMotion,
    });

    const styles = useMemo(
      () =>
        StyleSheet.create({
          position: {
            position: 'absolute',
            left,
            top,
            width: size,
            height: size,
          },
        }),
      [left, top, size],
    );

    return (
      <Animated.View
        // TODO(reanimated-types): DefaultStyle vs ViewStyle under exactOptionalPropertyTypes
        style={[styles.position, animatedStyle as object]}
        testID={tileId}
        importantForAccessibility="no"
      >
        <TileView value={value} size={size} />
      </Animated.View>
    );
  },
);

AnimatedTile.displayName = 'AnimatedTile';

export { AnimatedTile };
