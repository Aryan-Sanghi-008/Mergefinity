/**
 * @file BoardTileLayer.tsx
 * @layer components/organisms
 * @description Maps board cells to absolutely positioned AnimatedTile components.
 */

import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useBoardDimensions } from '@/hooks/useBoardDimensions';
import type { Board, CellValue } from '@/types';

import { AnimatedTile } from './AnimatedTile';

export interface BoardTileLayerProps {
  /** Current board (row-major). */
  board: Board;
}

/** Occupied cell rendered as an AnimatedTile. */
interface OccupiedTile {
  tileId: string;
  index: number;
  value: CellValue;
}

/**
 * Absolute tile overlay — keys by stable `tile-${index}` so theme swaps keep instances.
 */
const BoardTileLayer = memo(({ board }: BoardTileLayerProps) => {
  const { tileSize, cellOffsets } = useBoardDimensions();

  const occupied = useMemo((): OccupiedTile[] => {
    const tiles: OccupiedTile[] = [];
    for (let index = 0; index < board.length; index += 1) {
      const value = board[index];
      if (value !== undefined && value !== 0) {
        tiles.push({
          tileId: `tile-${index}`,
          index,
          value,
        });
      }
    }
    return tiles;
  }, [board]);

  return (
    <View style={styles.layer} pointerEvents="box-none">
      {occupied.map(({ tileId, index, value }) => {
        const offset = cellOffsets[index];
        if (offset === undefined) {
          return null;
        }
        return (
          <AnimatedTile
            key={tileId}
            tileId={tileId}
            value={value}
            left={offset.left}
            top={offset.top}
            size={tileSize}
          />
        );
      })}
    </View>
  );
});

BoardTileLayer.displayName = 'BoardTileLayer';

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
  },
});

export { BoardTileLayer };
