/**
 * @file GameBoard.tsx
 * @layer components/organisms
 * @description Square board with swipe gesture, edge pulse, and tile layer.
 */

import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { CellBackground } from '@/components/atoms';
import { STRINGS } from '@/constants';
import { useBoardDimensions } from '@/hooks/useBoardDimensions';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, type ThemeTokens } from '@/styles';
import type { BoardTileEntity, Direction } from '@/types';

import { BoardTileLayer } from './BoardTileLayer';

export interface GameBoardProps {
  /** Visual tile entities. */
  tiles: BoardTileEntity[];
  /** Swipe handler (JS thread). */
  onSwipe: (direction: Direction) => void;
  /** Animation lock shared value. */
  animationLock: SharedValue<boolean>;
  /** Edge-pulse animated style from useBoardShake. */
  edgePulseStyle: object;
}

/**
 * Perfect-square game board with pan gesture and absolute tiles.
 */
const GameBoard = memo(
  ({ tiles, onSwipe, animationLock, edgePulseStyle }: GameBoardProps) => {
    const { theme } = useTheme();
    const { boardSizePx, tileSize, cellOffsets, cellCount } = useBoardDimensions();
    const gesture = useSwipeGesture({ onSwipe, animationLock });
    const styles = useMemo(
      () => createStyles(theme, boardSizePx),
      [theme, boardSizePx],
    );

    const cellStyles = useMemo(
      () =>
        cellOffsets.map((offset) =>
          StyleSheet.create({
            cell: {
              position: 'absolute',
              left: offset.left,
              top: offset.top,
            },
          }).cell,
        ),
      [cellOffsets],
    );

    const cellIndices = useMemo(
      () => Array.from({ length: cellCount * cellCount }, (_, index) => index),
      [cellCount],
    );

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View
          // TODO(reanimated-types): DefaultStyle vs ViewStyle under exactOptionalPropertyTypes
          style={[styles.board, edgePulseStyle as object]}
          accessibilityLabel={STRINGS.A11Y_BOARD}
          accessibilityRole="summary"
        >
          {cellIndices.map((index) => {
            const cellStyle = cellStyles[index];
            if (cellStyle === undefined) {
              return null;
            }
            return (
              <View key={`bg-${index}`} style={cellStyle} importantForAccessibility="no">
                <CellBackground size={tileSize} />
              </View>
            );
          })}
          <BoardTileLayer tiles={tiles} />
        </Animated.View>
      </GestureDetector>
    );
  },
);

GameBoard.displayName = 'GameBoard';

function createStyles(theme: ThemeTokens, boardSizePx: number) {
  return StyleSheet.create({
    board: {
      width: boardSizePx,
      height: boardSizePx,
      borderRadius: SPACING_TOKENS.BOARD_RADIUS,
      backgroundColor: theme.BOARD_BG,
      overflow: 'hidden',
    },
  });
}

export { GameBoard };
