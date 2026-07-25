/**
 * @file BoardTileLayer.tsx
 * @layer components/organisms
 * @description Maps tile entities to absolutely positioned AnimatedTile components.
 */

import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useBoardDimensions } from '@/hooks/useBoardDimensions';
import type { BoardTileEntity } from '@/types';

import { AnimatedTile } from './AnimatedTile';

export interface BoardTileLayerProps {
  /** Visual tile entities with stable IDs. */
  tiles: BoardTileEntity[];
}

/**
 * Absolute tile overlay — keys by stable entity id across moves and theme swaps.
 */
const BoardTileLayer = memo(({ tiles }: BoardTileLayerProps) => {
  const { tileSize, cellOffsets } = useBoardDimensions();

  return (
    <View style={styles.layer} pointerEvents="box-none">
      {tiles.map((tile) => {
        const dest = cellOffsets[tile.index];
        const source = cellOffsets[tile.fromIndex];
        if (dest === undefined || source === undefined) {
          return null;
        }
        return (
          <AnimatedTile
            key={tile.id}
            tileId={tile.id}
            value={tile.value}
            left={dest.left}
            top={dest.top}
            fromLeft={source.left}
            fromTop={source.top}
            size={tileSize}
            phase={tile.phase}
            motionSeq={tile.motionSeq}
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
