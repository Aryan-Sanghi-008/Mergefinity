/**
 * @file GameBoard.tsx
 * @layer components/organisms
 * @description Square board: CellBackground grid + absolute AnimatedTile layer.
 */

import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { CellBackground } from '@/components/atoms';
import { STRINGS } from '@/constants';
import { useBoardDimensions } from '@/hooks/useBoardDimensions';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, type ThemeTokens } from '@/styles';
import type { Board } from '@/types';

import { BoardTileLayer } from './BoardTileLayer';

export interface GameBoardProps {
  /** Current board state. */
  board: Board;
}

/**
 * Perfect-square game board. Dimensions from `useBoardDimensions`; tiles from `BoardTileLayer`.
 */
const GameBoard = memo(({ board }: GameBoardProps) => {
  const { theme } = useTheme();
  const { boardSizePx, tileSize, cellOffsets, cellCount } = useBoardDimensions();
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
    <View
      style={styles.board}
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
      <BoardTileLayer board={board} />
    </View>
  );
});

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
