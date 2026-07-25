/**
 * @file tileEntities.ts
 * @layer utils
 * @description Pure UI tile-entity helpers for stable IDs across moves (P-07).
 */

import { TILE_MERGE_FACTOR } from '@/constants';
import type { Board, BoardTileEntity, CellValue, TileMove } from '@/types';

/** Creates a monotonic tile-id factory (no Date.now / Math.random). */
export function createTileIdFactory(start = 0): () => string {
  let next = start;
  return () => {
    next += 1;
    return `tile-${next}`;
  };
}

/**
 * Builds entities from a board snapshot (opening / new game).
 */
export function entitiesFromBoard(
  board: Readonly<Board>,
  createId: () => string,
): BoardTileEntity[] {
  const tiles: BoardTileEntity[] = [];
  for (let index = 0; index < board.length; index += 1) {
    const value = board[index];
    if (value !== undefined && value !== 0) {
      tiles.push(idleEntity(createId(), index, value));
    }
  }
  return tiles;
}

/**
 * Applies `tileMoves` onto current entities for the slide phase.
 * Merge pairs: first move is survivor, second is victim.
 */
export function entitiesForSlide(
  entities: readonly BoardTileEntity[],
  tileMoves: readonly TileMove[],
  motionSeq: number,
): BoardTileEntity[] {
  const byIndex = new Map(entities.map((tile) => [tile.index, tile]));
  const movingFrom = new Set(tileMoves.map((move) => move.from));
  const next: BoardTileEntity[] = [];

  for (const tile of entities) {
    if (!movingFrom.has(tile.index)) {
      next.push({
        ...tile,
        fromIndex: tile.index,
        phase: 'idle',
        isMergeSurvivor: false,
        isMergeVictim: false,
        isSpawn: false,
        motionSeq,
      });
    }
  }

  const byTo = new Map<number, TileMove[]>();
  for (const move of tileMoves) {
    const group = byTo.get(move.to) ?? [];
    group.push(move);
    byTo.set(move.to, group);
  }

  for (const [, moves] of byTo) {
    if (moves.length >= TILE_MERGE_FACTOR) {
      const survivorMove = moves[0]!;
      const victimMove = moves[1]!;
      const survivor = byIndex.get(survivorMove.from);
      const victim = byIndex.get(victimMove.from);
      if (survivor !== undefined) {
        next.push({
          ...survivor,
          fromIndex: survivor.index,
          index: survivorMove.to,
          value: survivor.value,
          phase: 'slide',
          isMergeSurvivor: true,
          isMergeVictim: false,
          isSpawn: false,
          motionSeq,
        });
      }
      if (victim !== undefined) {
        next.push({
          ...victim,
          fromIndex: victim.index,
          index: victimMove.to,
          value: victim.value,
          phase: 'slide',
          isMergeSurvivor: false,
          isMergeVictim: true,
          isSpawn: false,
          motionSeq,
        });
      }
      continue;
    }

    const move = moves[0];
    if (move === undefined) {
      continue;
    }
    const tile = byIndex.get(move.from);
    if (tile === undefined) {
      continue;
    }
    next.push({
      ...tile,
      fromIndex: tile.index,
      index: move.to,
      value: move.merged ? tile.value : move.value,
      phase: move.from === move.to ? 'idle' : 'slide',
      isMergeSurvivor: move.merged,
      isMergeVictim: false,
      isSpawn: false,
      motionSeq,
    });
  }

  return next;
}

/**
 * After slide: drop victims, promote survivors to merged value, play merge phase.
 */
export function entitiesForMerge(
  slideEntities: readonly BoardTileEntity[],
  tileMoves: readonly TileMove[],
  motionSeq: number,
): BoardTileEntity[] {
  const mergeValueByTo = new Map<number, CellValue>();
  for (const move of tileMoves) {
    if (move.merged) {
      mergeValueByTo.set(move.to, move.value);
    }
  }

  return slideEntities
    .filter((tile) => !tile.isMergeVictim)
    .map((tile) => {
      const mergedValue = mergeValueByTo.get(tile.index);
      if (tile.isMergeSurvivor && mergedValue !== undefined) {
        return {
          ...tile,
          fromIndex: tile.index,
          value: mergedValue,
          phase: 'merge' as const,
          isMergeSurvivor: true,
          isMergeVictim: false,
          isSpawn: false,
          motionSeq,
        };
      }
      return {
        ...tile,
        fromIndex: tile.index,
        phase: 'idle' as const,
        isMergeSurvivor: false,
        isMergeVictim: false,
        isSpawn: false,
        motionSeq,
      };
    });
}

/**
 * Diffs pre/post spawn boards and appends a spawn entity.
 */
export function entitiesWithSpawn(
  entities: readonly BoardTileEntity[],
  beforeSpawn: Readonly<Board>,
  afterSpawn: Readonly<Board>,
  createId: () => string,
  motionSeq: number,
): BoardTileEntity[] {
  let spawnIndex = -1;
  let spawnValue: CellValue = 0;
  for (let index = 0; index < afterSpawn.length; index += 1) {
    const before = beforeSpawn[index] ?? 0;
    const after = afterSpawn[index] ?? 0;
    if (before === 0 && after !== 0) {
      spawnIndex = index;
      spawnValue = after;
      break;
    }
  }

  const settled = entities.map((tile) => ({
    ...tile,
    fromIndex: tile.index,
    phase: 'idle' as const,
    isMergeSurvivor: false,
    isMergeVictim: false,
    isSpawn: false,
    motionSeq,
  }));

  if (spawnIndex < 0 || spawnValue === 0) {
    return settled;
  }

  return [
    ...settled,
    {
      ...idleEntity(createId(), spawnIndex, spawnValue),
      phase: 'spawn',
      isSpawn: true,
      motionSeq,
    },
  ];
}

/**
 * Settles all tiles to idle after spawn animation.
 */
export function entitiesSettled(
  entities: readonly BoardTileEntity[],
  motionSeq: number,
): BoardTileEntity[] {
  return entities.map((tile) => ({
    ...tile,
    fromIndex: tile.index,
    phase: 'idle' as const,
    isMergeSurvivor: false,
    isMergeVictim: false,
    isSpawn: false,
    motionSeq,
  }));
}

function idleEntity(
  id: string,
  index: number,
  value: CellValue,
): BoardTileEntity {
  return {
    id,
    index,
    fromIndex: index,
    value,
    phase: 'idle',
    isMergeSurvivor: false,
    isMergeVictim: false,
    isSpawn: false,
    motionSeq: 0,
  };
}
