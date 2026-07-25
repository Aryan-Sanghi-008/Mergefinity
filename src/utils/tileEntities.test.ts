/**
 * @file tileEntities.test.ts
 * @layer utils
 * @description Tests for UI tile-entity move / merge / spawn mapping.
 */

import type { Board, TileMove } from '@/types';

import {
  createTileIdFactory,
  entitiesForMerge,
  entitiesForSlide,
  entitiesFromBoard,
  entitiesWithSpawn,
} from './tileEntities';

describe('tileEntities', () => {
  it('builds entities from a board', () => {
    const board = [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4] as Board;
    const tiles = entitiesFromBoard(board, createTileIdFactory());
    expect(tiles).toHaveLength(2);
    expect(tiles[0]?.index).toBe(0);
    expect(tiles[0]?.value).toBe(2);
    expect(tiles[1]?.index).toBe(15);
    expect(tiles[1]?.value).toBe(4);
  });

  it('slides a tile and keeps stable id', () => {
    const board = [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as Board;
    const createId = createTileIdFactory();
    const start = entitiesFromBoard(board, createId);
    const id = start[0]!.id;
    const moves: TileMove[] = [{ from: 0, to: 3, value: 2, merged: false }];
    const slid = entitiesForSlide(start, moves, 1);
    expect(slid).toHaveLength(1);
    expect(slid[0]?.id).toBe(id);
    expect(slid[0]?.fromIndex).toBe(0);
    expect(slid[0]?.index).toBe(3);
    expect(slid[0]?.phase).toBe('slide');
  });

  it('marks merge survivor and victim, then promotes value', () => {
    const board = [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as Board;
    const start = entitiesFromBoard(board, createTileIdFactory());
    const moves: TileMove[] = [
      { from: 0, to: 0, value: 4, merged: true },
      { from: 1, to: 0, value: 4, merged: true },
    ];
    const slid = entitiesForSlide(start, moves, 1);
    expect(slid).toHaveLength(2);
    expect(slid.filter((t) => t.isMergeSurvivor)).toHaveLength(1);
    expect(slid.filter((t) => t.isMergeVictim)).toHaveLength(1);

    const merged = entitiesForMerge(slid, moves, 2);
    expect(merged).toHaveLength(1);
    expect(merged[0]?.value).toBe(4);
    expect(merged[0]?.phase).toBe('merge');
  });

  it('appends a spawn entity at the new cell', () => {
    const before = [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as Board;
    const after = [4, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as Board;
    const entities = entitiesFromBoard(before, createTileIdFactory());
    const next = entitiesWithSpawn(entities, before, after, createTileIdFactory(10), 3);
    expect(next).toHaveLength(2);
    const spawn = next.find((t) => t.isSpawn);
    expect(spawn?.index).toBe(2);
    expect(spawn?.value).toBe(2);
    expect(spawn?.phase).toBe('spawn');
  });
});
