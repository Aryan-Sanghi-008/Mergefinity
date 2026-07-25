# FRONTEND ENGINEERING RULES
## Mergefinity · 2048-Style Android Game · React Native + TypeScript
### For Cursor AI · v1.0 · 2025

A single source of truth for every engineering decision in this codebase. Read before writing a single line of code.

---

## 1. Project Philosophy & Non-Negotiables

1. **One concern per file** — A component file renders UI. A hook file encapsulates logic. A util file exports pure functions. Never mix.
2. **No implicit dependencies** — Every function receives everything it needs as explicit arguments.
3. **Immutability by default** — Game board state is always a new array — never mutate in place.
4. **TypeScript strict mode always on** — `strict: true`, `noImplicitAny: true`, `strictNullChecks: true`. No `@ts-ignore` without an explanatory comment.
5. **Zero magic numbers** — Every numeric literal that carries meaning lives in `constants/`.
6. **Cursor must be able to infer intent** — Every exported symbol has a JSDoc comment.

---

## 2. Folder & File Structure

```
src/
  app/                    # Expo Router screens (navigation only)
    (tabs)/
      index.tsx           # Home / Game screen
      settings.tsx
    _layout.tsx
  components/             # Atomic UI components
    atoms/                # Tile, ScoreBadge, IconButton
    molecules/            # BoardRow, ScorePanel, GameOverlay
    organisms/            # GameBoard, GameHeader
  hooks/                  # Custom React hooks (logic only)
  engine/                 # Pure game logic (no React)
  store/                  # Zustand state management
  types/                  # All TypeScript types & interfaces
  constants/              # All magic values
  utils/                  # Stateless helper functions
  styles/                 # Global design tokens
  assets/                 # fonts/, sounds/, images/
```

1. Feature folders are forbidden — no `src/features/game/` nesting.
2. Index files only for re-exports — no business logic inside index files.
3. Co-location of test files — `foo.ts` has sibling `foo.test.ts`.
4. Screen components are thin — `app/` imports organisms, calls hooks, passes data down.

---

## 3. Atomic Design System

- **Atoms** — Props only. No business logic. No store access.
- **Molecules** — Composed from 2+ atoms. One focused piece of local UI state max.
- **Organisms** — May consume hooks. Never calls `engine/` directly.
- **Screens (`app/`)** — Compose organisms. Zero inline styles. Zero game logic.

Every component is `memo`-wrapped with `displayName`. Styles via `StyleSheet.create()` only.

---

## 4. Types & Interfaces

All types live in `types/`. No inline type literals in components. Prefer `interface` for objects, `type` for unions. No `any`. Ever.

Key types: `CellValue`, `Board`, `Direction`, `TileMove`, `GameSnapshot`, `MoveResult`, `GameStatus`, `GameState`, `GameActions`, `GameStore`.

---

## 5. Constants, Strings & Enums

Every magic value lives in `constants/`. Use `as const` on every constants object. All user-visible text in `strings.constants.ts`. Animation durations only in `animation.constants.ts`.

---

## 6. Component Rules

1. Every component is memo-wrapped
2. `displayName` on every memo component
3. `StyleSheet.create()` only — no inline style objects
4. No `useEffect` for derived state
5. No anonymous default exports
6. Nested ternaries banned

---

## 7. Pure Functions & No Side Effects

Functions in `engine/` and `utils/` must be pure:

1. Never mutate an argument
2. No `console.log` without `__DEV__` guard
3. Inject `rng: () => number` — no hardcoded `Math.random()`
4. No async inside `engine/`
5. Error handling via return types, not throw

---

## 8. State Management

Zustand stores. Components never own game state. Selectors at the hook call site. Persist only `bestScore` / settings. History capped at 5 snapshots.

---

## 9. Game Logic Architecture

| File | Responsibility |
|------|----------------|
| `boardUtils.ts` | createEmptyBoard, spawnTile, getEmptyCells, shiftRowLeft |
| `moveResolver.ts` | resolveMove via rotation abstraction |
| `scoreCalculator.ts` | calculateMergeBonuses |
| `winCondition.ts` | isWon, isLost |

---

## 10. Naming Conventions

| What | Format | Example |
|------|--------|---------|
| Component | PascalCase | `GameBoard` |
| Hook | `use` + PascalCase | `useGameEngine` |
| Pure function | camelCase, verb-first | `resolveMove` |
| Constant | SCREAMING_SNAKE | `BOARD_SIZE` |
| File — component | `PascalCase.tsx` | `Tile.tsx` |
| File — logic | `camelCase.ts` | `moveResolver.ts` |

---

## 11. Import / Export Rules

- Path alias: `@/*` → `src/*`
- Named exports everywhere — no default exports
- `import type` for type-only imports
- Barrel exports via `index.ts`
- No circular imports: `engine/` never imports from `hooks/` or `store/`

---

## 12. Performance & Modern Patterns

- Reanimated shared values for all tile animations (never RN Animated API)
- `useMemo` for board-derived computations
- `useCallback` for event handlers passed as props
- Zustand targeted selectors
- Worklets for gesture callbacks; `runOnJS` for store dispatch

---

## 13. Anti-Patterns Checklist

**Hard blocks:** magic numbers, relative cross-folder imports, useEffect for sync, board mutation, `any`, default exports, inline styles, console.log outside `__DEV__`, logic in screens, direct store access in components.

**Soft warnings:** component >120 lines, hook >80 lines, pure function >3 args, empty-deps useEffect.
