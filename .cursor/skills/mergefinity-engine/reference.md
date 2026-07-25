# Engine Algorithm Reference

## Board

Flat `CellValue[]` length 16, row-major: `index = row * BOARD_SIZE + col`.

## shiftRowLeft

1. Filter zeros
2. Merge adjacent equal pairs left-to-right (single pass; no chain merges)
3. Pad with zeros to length `BOARD_SIZE`
4. Return `{ row, delta }` where delta is sum of merged values

## rotateBoard (90° clockwise)

`new[r][c] = old[n-1-c][r]` repeated `times % 4`.

## resolveMove

```
[pre, post] = DIR_ROTATIONS[dir]
rotated = rotate(board, pre)
shifted = each row shiftRowLeft
result = rotate(shifted, post)
boardChanged = result differs from input
```

## spawnTile

Pick random empty index via `rng`; value 2 if `rng() < SPAWN_WEIGHT_2` else 4.

## isLost

No empty cells AND no horizontal/vertical adjacent equal pairs.

## Test pattern

```ts
describe('resolveMove', () => {
  it('merges two equal tiles when swiping LEFT', () => {
    const board = [0,0,2,2, 0,0,0,0, 0,0,0,0, 0,0,0,0] as Board;
    const { board: next, scoreDelta, boardChanged } = resolveMove(board, 'LEFT');
    expect(next[0]).toBe(4);
    expect(scoreDelta).toBe(4);
    expect(boardChanged).toBe(true);
  });
});
```
