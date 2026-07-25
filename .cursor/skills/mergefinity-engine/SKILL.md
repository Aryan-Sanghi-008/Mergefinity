---
name: mergefinity-engine
description: >-
  Pure 2048 game engine algorithms for Mergefinity — board utils, rotation-based
  resolveMove, win/loss, and Jest test patterns. Use when editing src/engine/,
  writing move/spawn/merge logic, or adding engine unit tests.
---

# Mergefinity Engine

## When to use

Working in `src/engine/` or implementing board/move/win logic.

## Rules

1. Pure TypeScript only — no React, async, store
2. Never mutate board arguments
3. Inject `rng` for `spawnTile`
4. All directions via rotate → `shiftRowLeft` → rotate back

## DIR_ROTATIONS

```
LEFT:  [0, 0]
RIGHT: [2, 2]
UP:    [3, 1]
DOWN:  [1, 3]
```

## Required exports

- `boardUtils`: `createEmptyBoard`, `getEmptyCells`, `spawnTile`, `shiftRowLeft`
- `moveResolver`: `resolveMove` (+ internal rotate)
- `winCondition`: `isWon`, `isLost`
- `scoreCalculator`: merge score helpers

## Tests

Co-locate `*.test.ts`. Seed rng. `Object.freeze` boards for immutability.

## Details

See [reference.md](reference.md) and `docs/cursor/cursor_skills.md` SK-06/SK-07.
