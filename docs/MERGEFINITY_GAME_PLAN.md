# Mergefinity — Comprehensive Game Development Plan

> A premium 2048-style puzzle game for Android · React Native + Expo + TypeScript

---

**20 Phases · 15 Weeks · 4 Game Modes · 20 Achievements · 5 Themes · 3 IAP Products**

---

## Table of Contents

| Phase | Name | Category | Timeline |
|-------|------|----------|----------|
| P-00 | Pre-production & visual identity | Pre-production | Week 1 |
| P-01 | Technical foundation | Foundation | Weeks 1–2 |
| P-02 | Type system & constants scaffold | Foundation | Week 2 |
| P-03 | Game engine — pure TypeScript | Engine | Weeks 2–3 |
| P-04 | Design tokens & theme system | Design System | Week 3 |
| P-05 | Atom & molecule components | Design System | Weeks 3–4 |
| P-06 | Game board UI | Board UI | Weeks 4–5 |
| P-07 | Animation system | Board UI | Weeks 5–6 |
| P-08 | Gesture & haptic input | Board UI | Week 6 |
| P-09 | State management & persistence | Foundation | Weeks 6–7 |
| P-10 | Game modes | Features | Weeks 7–8 |
| P-11 | Statistics system | Features | Week 8 |
| P-12 | Achievement system | Features | Weeks 8–9 |
| P-13 | Theme system & unlockables | Features | Weeks 9–10 |
| P-14 | Screen architecture | Board UI | Week 10 |
| P-15 | Audio & haptics polish | Features | Weeks 10–11 |
| P-16 | Monetization | Monetization | Weeks 11–12 |
| P-17 | Performance audit | Foundation | Week 12 |
| P-18 | Testing suite | Foundation | Weeks 12–13 |
| P-19 | Pre-launch polish & store assets | Launch | Weeks 13–14 |
| P-20 | Launch & post-launch roadmap | Launch | Weeks 14–15+ |

---

## P-00 · Pre-production & Visual Identity

**Category:** Pre-production  
**Timeline:** Week 1  
**Objective:** Define the soul of the game before a single line of code. Every visual decision from here will reference this document.

### Deliverables

- Brand personality brief: refined, minimal, deeply satisfying — no cartoon affect, no emoji, no confetti explosions
- Typography decision: Inter for all UI chrome; Space Grotesk Bold for tile numerals (high-contrast, geometric, legible at small sizes)
- Tile color map defined for values 2 through 131072 — warm cream progression into electric gold at 2048
- Motion language brief: spring-physics-based, sub-200ms slides, tactile pop on merge, no bouncing UI chrome
- Competitor audit: Threes!, 2048 (Cirulli), 2048 Premium iOS, 1024! — documented gaps and opportunities
- Board treatment decision: 8dp rounded tiles, 3px gap between cells, board has 10dp outer radius, no drop shadows on tiles
- Wireframes approved: game screen, settings, statistics, achievements, theme picker
- Accessibility brief: minimum 4.5:1 contrast on tile text, tap targets minimum 44x44dp, TalkBack labels for all interactive elements

### Key Outputs

```
docs/DESIGN_BRIEF.md
docs/TILE_COLOR_MAP.md
docs/MOTION_LANGUAGE.md
docs/COMPETITOR_AUDIT.md
docs/wireframes/          (markdown layouts + low-fi PNG mocks)
docs/TYPOGRAPHY.md
```

### Open Decisions — Resolved

| Decision | Resolution | Recorded in |
|----------|------------|-------------|
| Score pop-up | Both floating `+N` delta **and** animated counter roll | `DESIGN_BRIEF.md`, P-07 |
| Blocked move feedback | Board edge pulse / border flash (not full-board shake as primary) | `DESIGN_BRIEF.md`, `MOTION_LANGUAGE.md`, P-07 |
| Undo limit | Classic & Endless: 3/game; Challenge: 1; Time Attack: unlimited; IAP may unlock unlimited | `DESIGN_BRIEF.md`, P-09 / P-10 |

### Definition of Done

- [x] `DESIGN_BRIEF.md` committed and reviewed by all contributors
- [x] All wireframes signed off — no open layout questions remain
- [x] Tile color progression renders correctly across Classic, Dark, Midnight themes on paper

---

## P-01 · Technical Foundation

**Category:** Foundation  
**Timeline:** Weeks 1–2  
**Objective:** Stand up a correctly configured project that any contributor can clone and run on the first try.

### Deliverables

- Expo managed project initialized with blank TypeScript template
- `tsconfig.json`: strict, noImplicitAny, strictNullChecks, noUnusedLocals, exactOptionalPropertyTypes, noUncheckedIndexedAccess, bundler module resolution
- Path aliases configured: `@/*` → `src/*`
- ESLint configured per `frontend_rules.pdf`: import order, no-default-export, consistent-type-imports, no-magic-numbers, no-console
- Prettier configured: 2-space indent, single quotes, trailing commas, 100 char line width
- All production dependencies installed and version-locked
- Git initialized with `.gitignore`, husky pre-commit hook running lint + typecheck
- EAS CLI configured for local builds (`eas.json`: development, preview, production profiles)
- All top-level `src/` folders created with `.gitkeep`

### Key Files

```
package.json
tsconfig.json
eslint.config.js
.prettierrc
eas.json
app.json
.husky/pre-commit
babel.config.js          (module-resolver for @/* aliases)
```

### Pinned Dependencies

> **Note (P-01 amendment):** Stack pinned to the **Expo SDK 57** line already in-repo (not the original ~51 draft). Versions below match `package.json` / lockfile intent.

| Package | Version |
|---------|---------|
| expo | ~57.x |
| react-native | 0.86.x |
| react-native-reanimated | ~4.x |
| react-native-gesture-handler | ~2.x |
| zustand | ^5.x |
| expo-router | ~57.x |
| @react-native-async-storage/async-storage | ^2.x |
| expo-haptics | ~57.x |
| expo-font | ~57.x |
| expo-keep-awake | ~57.x |
| typescript | ~5.x / ~6.x (Expo 57 toolchain) |
| jest | ^29.x |
| @testing-library/react-native | ^14.x |

### Definition of Done

- [x] `npx expo start` runs without errors on a fresh clone
- [x] `npx tsc --noEmit` passes with zero errors
- [x] `npx eslint src/` passes with zero errors
- [x] Pre-commit hook blocks a commit that introduces a type error

---

## P-02 · Type System & Constants Scaffold

**Category:** Foundation  
**Timeline:** Week 2  
**Objective:** Define every type, interface, and constant that will be referenced across the entire codebase — so Cursor always has a complete picture of the domain.

### Types to Define

- `CellValue`: union of `0 | 2 | 4 | 8 | ... | 131072`
- `Board`: `CellValue[]` — flat 16-element array, row-major
- `Direction`: `'UP' | 'DOWN' | 'LEFT' | 'RIGHT'`
- `TileMove`: `{ from, to, value, merged }` — for animation coordination
- `MoveResult`: `{ board, scoreDelta, tileMoves, boardChanged }`
- `GameSnapshot`: `{ board, score, moves, timestamp }` — for undo
- `GameStatus`: `'idle' | 'playing' | 'won' | 'lost' | 'animating'`
- `GameMode`: `'classic' | 'endless' | 'challenge' | 'time-attack'`
- `ThemeName`: `'classic' | 'dark' | 'midnight' | 'obsidian' | 'ivory'`
- `Achievement`, `AchievementId`, `AchievementStatus`
- `GameStats`, `LifetimeStats`, `SessionRecord`

### Constants to Define

- `BOARD_SIZE = 4`, `CELL_COUNT = 16`, `WIN_VALUE = 2048`
- `SPAWN_VALUES`, `SPAWN_WEIGHT_2 = 0.9`, `MAX_UNDO_HISTORY = 3`
- `TILE_COLORS`, `TILE_TEXT_COLORS` (per `CellValue`)
- `BOARD_PADDING_DP`, `TILE_GAP_DP`, `TILE_RADIUS_DP`
- `SLIDE_DURATION_MS`, `MERGE_DURATION_MS`, `SPAWN_DURATION_MS`
- `MERGE_SCALE = 1.15`, `SPAWN_INITIAL_SCALE = 0.0`
- `SWIPE_MIN_DISTANCE = 20`, `SWIPE_VELOCITY_THRESHOLD = 200`
- `STRINGS`: all 40+ user-visible text strings
- `STORAGE_KEYS`: namespaced keys for all AsyncStorage entries

### Key Files

```
src/types/game.types.ts
src/types/store.types.ts
src/types/ui.types.ts
src/types/stats.types.ts
src/types/index.ts
src/constants/board.constants.ts
src/constants/animation.constants.ts
src/constants/strings.constants.ts
src/constants/colors.constants.ts
src/constants/storage.constants.ts
src/constants/index.ts
```

### Definition of Done

- [x] Every `CellValue` from 0 to 131072 has a tile color in `TILE_COLORS`
- [x] Zero raw **user-visible** string literals exist anywhere outside `constants/strings.constants.ts` (StyleSheet / `displayName` / storage keys / font tokens excluded)
- [x] All types exported from `types/index.ts` and importable via `@/types`
- [x] JSDoc comment on every exported symbol

---

## P-03 · Game Engine — Pure TypeScript

**Category:** Engine  
**Timeline:** Weeks 2–3  
**Objective:** Build a fully tested, framework-agnostic game engine that can run in Node, a web worker, or a test suite with zero setup overhead.

### Functions to Implement

- `createEmptyBoard()` — `Array(16).fill(0)`, typed as `Board`
- `getEmptyCells(board)` — returns flat indices of zero cells
- `spawnTile(board, rng?)` — injects one new tile at a random empty cell; `rng` is injectable for deterministic testing
- `cloneBoard(board)` — `structuredClone` wrapper, guarantees immutability
- `shiftRowLeft(row)` — the core merge algorithm: filter zeros, merge adjacent equal pairs left-to-right (single pair per tile per move), pad zeros; returns `{ row, delta }`
- `rotateBoard(board, times)` — clockwise 90-degree rotation; used to reduce all 4 directions to a single left-shift algorithm
- `resolveMove(board, dir)` — rotate, shift every row left, rotate back; returns full `MoveResult`
- `isWon(board)` — `board.some(v => v >= WIN_VALUE)`
- `isLost(board)` — no empty cells AND no adjacent equal pairs in any direction
- `calculateMergeScore(mergedValues)` — sum of all merged tile values

### Direction Abstraction via Rotation

The rotation approach eliminates four separate shift algorithms. All directions are resolved by rotating the board to align the target direction with "left", applying `shiftRowLeft` to each row, then rotating back.

```
Direction   Pre-rotation   Post-rotation
LEFT        0              0
RIGHT       2              2
UP          3              1
DOWN        1              3
```

### Test Coverage Targets

- `shiftRowLeft`: 12 cases — empty row, single tile, all same, alternating, triple same, already-merged blocking, zeros interspersed
- `resolveMove`: all 4 directions, no-change detection, corner tile merges, multi-merge in one swipe
- `isLost`: board full with no merges, board full with one merge available, board with empty cell
- `spawnTile`: seeded rng produces deterministic results, never overwrites existing tile
- Immutability: every function asserted to return a new array reference

### Key Files

```
src/engine/boardUtils.ts
src/engine/rowShifter.ts
src/engine/boardRotator.ts
src/engine/moveResolver.ts
src/engine/winCondition.ts
src/engine/scoreCalculator.ts
src/engine/boardUtils.test.ts
src/engine/moveResolver.test.ts
src/engine/winCondition.test.ts
```

### Definition of Done

- [x] `npx jest --coverage` shows 100% statement coverage on all engine files
- [x] No import from React, Reanimated, Zustand, or any RN module anywhere in `engine/`
- [x] `resolveMove(board, 'LEFT')` and `resolveMove(rotated, 'RIGHT')` produce identical boards for a symmetric position
- [x] Engine runs in bare Node via `ts-node` with no special setup (`npm run engine:smoke`)

---

## P-04 · Design Tokens & Theme System

**Category:** Design System  
**Timeline:** Week 3  
**Objective:** Create a single authoritative token set that every component reads — no raw color hex, font size, or spacing value lives outside this layer.

### Token Categories

- **Board colors:** `BOARD_BG`, `CELL_EMPTY` — per theme
- **Tile colors:** full `TILE_BG` and `TILE_TEXT` maps for all 14 values per theme (classic warm cream through deep gold at 2048; continues into electric amber/white for post-2048)
- **UI chrome:** `TEXT_PRIMARY`, `TEXT_SECONDARY`, `TEXT_MUTED`, `SURFACE`, `DIVIDER`, `BUTTON_BG`, `BUTTON_TEXT`
- **Typography:** `FONT_TILE` (Space Grotesk Bold), `FONT_UI` (Inter), tile size scale (36sp for 2-digit, 30sp for 3-digit, 24sp for 4-digit, 20sp for 5-digit)
- **Spacing:** `BOARD_PADDING` (12dp), `TILE_GAP` (8dp), `SCREEN_PADDING` (16dp), `CARD_RADIUS` (12dp), `TILE_RADIUS` (6dp)
- **Shadows:** `TILE_ELEVATION` (Android 2dp), `BOARD_ELEVATION` (4dp)
- **Motion:** all spring and timing configs as typed objects, not raw numbers

> **P-04 lock:** Spacing/elevation values above are authoritative for implementation (supersede P-00’s 3px gap / 8dp tile radius / zero tile elevation for the token layer).

### Themes to Implement

| Theme | Type | Description |
|-------|------|-------------|
| Classic | Free | Warm cream (#FAF8EF) background, tan board (#BBADA0), cream-to-gold tile progression |
| Dark | Free | Near-black (#111118) surface, muted board, desaturated and cooled tile colors |
| Midnight | Free | Deep navy (#0A0F2E) surface, indigo board, tiles shift from cool steel to electric blue at 2048 |
| Obsidian | IAP | Pure black (#0A0A0A) surface, graphite board, slate-to-electric progression; 2048 tile is white text on electric blue |
| Ivory | IAP | Warm off-white (#FEFEF4) surface, barely-there board (#E8E6DE), pastel tiles with soft watercolor tints |

### Key Files

```
src/styles/theme.ts
src/styles/themes/classic.theme.ts
src/styles/themes/dark.theme.ts
src/styles/themes/midnight.theme.ts
src/styles/themes/obsidian.theme.ts
src/styles/themes/ivory.theme.ts
src/styles/typography.ts
src/styles/spacing.ts
src/styles/animations.ts
src/styles/index.ts
```

### Definition of Done

- [x] Swapping `ThemeName` from `'classic'` to `'midnight'` changes every visual in a test screen without a rebuild (`app/theme-lab.tsx` + `ThemeProvider`)
- [x] Every tile text color passes WCAG AA contrast against its tile background in all 5 themes
- [x] No raw color hex, spacing value, or font size exists outside `src/styles/`

---

## P-05 · Atom & Molecule Components

**Category:** Design System  
**Timeline:** Weeks 3–4  
**Objective:** Build every reusable UI primitive — each memo-wrapped, theme-aware, and documented — before any game-specific composition begins.

### Atoms

| Component | Responsibility |
|-----------|---------------|
| `TileView` | Renders tile value + background color; accepts `animatedStyle` prop; memo-wrapped; `displayName` set |
| `CellBackground` | Renders empty board cell; theme-aware `CELL_EMPTY` color; fixed tile dimensions from `useBoardDimensions` |
| `TileText` | Space Grotesk Bold numeral; size derived from value magnitude; theme-aware text color |
| `PrimaryButton` | Pressable, themed, haptic on press, disabled state, loading state |
| `IconButton` | 44x44dp tap target; accepts icon name from constrained `IconName` type union |
| `ScoreLabel` | 'SCORE' / 'BEST' label in small caps, muted, themed |
| `ScoreValue` | Large animated numeral; accepts shared value for counter animation |
| `Divider` | 0.5dp line, theme `DIVIDER` color, optional orientation |
| `StatusBadge` | Win / loss / streak indicator; themed; sentence-case text |
| `Toast` | Slide-up achievement notification; auto-dismisses in 3s; icon glyph, no emoji |

### Molecules

| Component | Responsibility |
|-----------|---------------|
| `ScorePanel` | Score + best score, side by side, animated on change |
| `ControlBar` | New game button + undo button; undo disabled when history empty |
| `GameOverOverlay` | Full-screen dimmed modal; final score; Try Again + New Game |
| `WinOverlay` | Keep Going + New Game; dismisses after Continue pressed |
| `ModeSelector` | Horizontal scrolling pill row for game mode selection |
| `StatRow` | Label + value pair for statistics screen; right-aligned value |
| `AchievementCard` | Icon glyph + name + description + locked/unlocked state |
| `ThemePreviewTile` | 2x2 mini board showing tile colors for a given theme |

### Key Files

```
src/components/atoms/
src/components/molecules/
src/components/atoms/index.ts
src/components/molecules/index.ts
```

### Definition of Done

- [x] Every atom renders correctly with all 5 themes without any conditional logic inside the component
- [x] Every component is exported named from its `atoms/index.ts` or `molecules/index.ts` barrel
- [x] No component file imports from another component file directly — only from index barrels

---

## P-06 · Game Board UI

**Category:** Board UI  
**Timeline:** Weeks 4–5  
**Objective:** Compose atoms and molecules into the full game screen organisms — the board, header, and controls. Static first, animated in P-07.

### Organisms to Build

- **GameBoard:** absolute-positioned tile layer over a fixed grid of `CellBackground` components; board dimensions derived from `useBoardDimensions` hook; tiles keyed by stable ID to preserve Reanimated shared values across renders
- **GameHeader:** game title (left) + `ScorePanel` (right); minimal chrome, maximum game area
- **GameControls:** `ControlBar` positioned below board; undo count badge when history non-empty
- **BoardTileLayer:** maps board array to absolutely positioned `AnimatedTile` components; layout calculated from `tileSize + gap + index`

### Layout Rules

- Board is always a perfect square; `width = device width - 2 × SCREEN_PADDING`
- Tile position calculated once per board size change via `useBoardDimensions`, never recalculated per render
- Game screen is a flex column: header (fixed height) + board (square, centered) + controls (fixed height)
- Tile absolute position: `left = (col × (tileSize + gap)) + gap`; `top = (row × (tileSize + gap)) + gap`
- No `ScrollView` on the game screen — the board must always be fully visible without scrolling on any supported device

### Key Files

```
src/components/organisms/GameBoard.tsx
src/components/organisms/GameHeader.tsx
src/components/organisms/BoardTileLayer.tsx
src/components/organisms/GameControls.tsx
src/hooks/useBoardDimensions.ts
src/components/organisms/index.ts
```

### Definition of Done

- [x] Board renders a static initial state correctly on Pixel 4a, Samsung A52, and a 6-inch tablet
- [x] Tile positions are pixel-perfect — no gap inconsistencies at any screen density
- [x] Switching theme live repaints board without unmounting tile components (keys preserved)

---

## P-07 · Animation System

**Category:** Board UI  
**Timeline:** Weeks 5–6  
**Objective:** Make every tile movement and merge physically satisfying — all animations on the UI thread, zero JS-thread frame drops during a swipe.

### Animations to Implement

| Animation | Specification |
|-----------|--------------|
| Tile slide | `translateX`/`Y` from source to target using `withTiming` + `Easing.out(Easing.quad)`; duration `SLIDE_DURATION_MS` (120ms) |
| Tile merge pop | Scale `withSequence(withTiming(1.15, 60ms), withSpring(1, { damping: 12, stiffness: 200 }))`; fires after slide completes |
| New tile spawn | Scale from 0 to 1 with `withSpring`, opacity 0 to 1; starts after slide + merge complete, staggered by `SPAWN_DELAY_MS` |
| Score delta float | A +N label spawns at score panel, translates up 40dp, fades out over 600ms |
| Board edge pulse | Board border flashes to accent color and fades when a move makes no change |
| Game over overlay | Opacity 0→1 + `translateY` from 20dp to 0, `withTiming` 300ms |
| Win overlay | Same as game over with a brief scale overshoot on the central card |
| Score counter roll | Score value animates as a rolling number, not a snap jump |

### Animation Architecture

- Each tile carries its own set of shared values: `translateX`, `translateY`, `scale`, `opacity` — all initialized in `useAnimatedTile` hook
- Tile IDs are stable across moves — the same tile component keeps its shared values through repositioning
- Animation sequencing: slide phase completes fully before merge phase fires
- `ANIMATION_LOCK` flag in game store: set `true` at animation start, `false` in callback; gesture handler checks this flag before dispatching
- All animation durations reference `animation.constants.ts` — zero hardcoded millisecond values

### Key Files

```
src/hooks/useAnimatedTile.ts
src/hooks/useScoreDelta.ts
src/hooks/useBoardShake.ts
src/hooks/useOverlayAnimation.ts
src/hooks/useScoreCounter.ts
src/hooks/useAnimationLock.ts
```

### Definition of Done

- [x] JS thread Systrace shows zero JS work during a swipe gesture execution
- [x] Rapid successive swipes (4 per second) never produce visual glitches or out-of-order tile positions
- [x] Merge pop animation plays on the correct tile even when multiple merges happen in the same move

---

## P-08 · Gesture & Haptic Input

**Category:** Board UI  
**Timeline:** Week 6  
**Objective:** Wire swipe detection to game logic with native-thread precision — no gesture should feel sluggish or missed, even on a budget Android device.

### Gesture Implementation

- `Gesture.Pan()` on the `GameBoard` root view — single gesture for all 4 directions
- Direction resolved in `onEnd` worklet using both `translationX/Y` and `velocityX/Y`; velocity wins when a diagonal swipe is ambiguous (velocity magnitude > 500)
- `minDistance`: `SWIPE_MIN_DISTANCE` constant (20dp) — prevents accidental trigger on a tap
- `minVelocity`: `SWIPE_VELOCITY_THRESHOLD` constant (200dp/s)
- Multi-touch protection: `Gesture.Pan().maxPointers(1)` — second finger during a swipe is ignored
- Animation lock check: `onEnd` reads `animationLock` shared value; if `true`, swipe is discarded silently
- `runOnJS(dispatchMove)(dir)` crosses to JS thread for Zustand dispatch

### Haptic Feedback Map

| Event | Feedback type |
|-------|--------------|
| Valid move (board changes) | `ImpactFeedbackStyle.Light` |
| Merge event | `ImpactFeedbackStyle.Medium` |
| Blocked move (no change) | None — silent |
| Win condition reached | `NotificationFeedbackType.Success` |
| Game over | `NotificationFeedbackType.Error` |
| Achievement unlock | `NotificationFeedbackType.Warning` |
| New game button | `ImpactFeedbackStyle.Medium` |

All haptic calls gated by `settingsStore.hapticsEnabled`.

### Key Files

```
src/hooks/useSwipeGesture.ts
src/utils/haptics.utils.ts
app/_layout.tsx            (GestureHandlerRootView)
```

### Definition of Done

- [x] All 4 directions register correctly in 200 manually executed rapid swipes across 3 devices
- [x] Tapping (not swiping) the board never triggers a move
- [x] Haptics toggle in settings is respected immediately without restarting the game

---

## P-09 · State Management & Persistence

**Category:** Foundation  
**Timeline:** Weeks 6–7  
**Objective:** Implement the authoritative Zustand stores that drive every screen, with selective persistence that survives app kills and OS restarts.

### Store Architecture

| Store | State | Persisted |
|-------|-------|-----------|
| `gameStore` | board, score, bestScore, status, history (capped 3), activeMode, animationLock | Session (`board`, `score`, `status`, `history`, `undosRemaining`, `moveCount`, `continuedAfterWin`) + `bestScore`, `activeMode` — satisfies kill/resume DoD; `animationLock` ephemeral |
| `settingsStore` | theme, hapticsEnabled, soundEnabled, boardSize | Everything |
| `statsStore` | per-mode lifetime stats, sessionHistory (last 10) | Lifetime stats |
| `achievementStore` | `Record<AchievementId, AchievementStatus>` | Everything |
| `purchaseStore` | hasRemovedAds, hasPremiumThemes | Everything |

### Middleware Stack Order

```
devtools (dev only)
  → persist (AsyncStorage)
    → store implementation
```

### Selector Pattern

All store consumption via targeted selectors: `useGameStore(s => s.score)` — never subscribe to the full store object. No component directly imports from any store — always via a hook in `hooks/`.

### Key Files

```
src/store/gameStore.ts
src/store/settingsStore.ts
src/store/statsStore.ts
src/store/achievementStore.ts
src/store/purchaseStore.ts
src/store/middleware/analytics.middleware.ts
src/hooks/useGameEngine.ts
src/hooks/useHighScore.ts
```

### Definition of Done

- [x] Killing the app mid-game and reopening shows the game at exactly the pre-kill board state
- [x] Best score persists across installs (Android backup enabled in `app.json`)
- [x] Undo correctly restores both board and score, and disables itself after 3 uses in one game

---

## P-10 · Game Modes

**Category:** Features  
**Timeline:** Weeks 7–8  
**Objective:** Extend the single core engine to support four distinct play experiences — each with its own board configuration, win condition, and scoring rule.

### Mode Specifications

| Mode | Board | Win Condition | Undo Limit | Timer |
|------|-------|--------------|------------|-------|
| Classic | 4x4 | Reach 2048 | 3 | None |
| Endless | 4x4 | None (continue past 2048) | 3 | None |
| Challenge | 5x5 | Reach 4096 | 1 | None |
| Time Attack | 4x4 | Highest score at timer expiry | Unlimited | 120 seconds |

### Implementation Notes

- `MODE_CONFIG` record in constants maps each `GameMode` to its `boardSize`, `winValue`, `undoLimit`, `hasTimer`, `timerSeconds`
- `gameStore` reads `MODE_CONFIG[activeMode]` at runtime — zero conditional logic in engine functions
- Mode switcher on home screen: pill selector row above board; switching triggers a soft restart confirmation if a game is in progress
- Per-mode best scores stored separately in `statsStore`
- Time Attack countdown uses `useCountdown` hook backed by a Reanimated shared value for smooth display without JS re-renders per tick
- Timer pauses on app background via `AppState` listener in `useGameEngine`

### Key Files

```
src/constants/modes.constants.ts
src/hooks/useCountdown.ts
src/hooks/useGameMode.ts
src/components/molecules/ModeSelector.tsx
```

### Definition of Done

- [x] All 4 modes playable end-to-end including win/loss transitions
- [x] Switching from Classic to Challenge visually resizes the board without any layout flicker
- [x] Time Attack timer pauses correctly on background and resumes accurately on foreground

---

## P-11 · Statistics System

**Category:** Features  
**Timeline:** Week 8  
**Objective:** Give players a reason to return — a rich statistics screen that makes every session feel meaningful and progress visible.

### Statistics Tracked

**Per mode:** games played, wins, losses, win rate %, best score, best tile value reached, total merges, average score

**Global lifetime:** total games across all modes, total play time (minutes), all-time best score, all-time best tile

**Session history:** last 10 game records (mode, score, best tile, duration, date)

**Streaks:** current win streak, longest win streak, current play streak (days), longest play streak

**Merge histogram:** how many times each tile value has been created (2, 4, 8, ..., 2048)

### Statistics Screen Design

- Header: all-time best score prominently displayed, total games
- Mode tabs: Classic / Challenge / Endless / Time Attack
- Key metrics as large numerals with muted labels (no emoji, no icons for key stats)
- Session history list: each row shows date, mode badge, score, best tile value
- Merge histogram: horizontal bar chart using React Native `View` widths scaled to percentages — no charting library needed
- Reset statistics option in settings (with confirmation dialog)

### Key Files

```
src/store/statsStore.ts
src/types/stats.types.ts
src/hooks/useStats.ts
app/statistics.tsx
src/components/molecules/StatRow.tsx
src/components/molecules/SessionCard.tsx
src/components/molecules/MergeBar.tsx
```

### Definition of Done

- [x] Statistics update correctly after every game, including when the app is killed mid-update
- [x] Win rate % is accurate to the nearest integer across 50 simulated games
- [x] Reset statistics leaves all gameplay (board, best score) intact and only clears stats records

---

## P-12 · Achievement System

**Category:** Features  
**Timeline:** Weeks 8–9  
**Objective:** Reward mastery and consistency with 20 achievements that create long-term engagement loops beyond the core 2048 goal.

### Achievement Roster

**Milestones**
- First Win — reach 2048
- Halfway There — reach 1024
- Double Down — reach 4096
- Legendary — reach 8192
- The Summit — reach 131072

**Speed**
- Quick Victory — reach 2048 in under 3 minutes
- Blitz — 100 moves in Time Attack
- Speed Demon — Time Attack score over 20,000

**Strategy**
- Purist — reach 2048 with 0 undos used
- Efficient — reach 2048 in under 150 moves
- Corner Master — win with 2048 tile in a corner

**Dedication**
- Century Club — 100 games played
- Committed — play 7 days in a row
- Veteran — 500 games played
- Unstoppable — 10-game win streak

**Exploration**
- Challenge Accepted — win Challenge mode
- Against the Clock — win Time Attack
- All-Rounder — win all 4 modes

**Curiosity**
- The Beginning — first game played
- Comeback — win after 3 consecutive losses

### Implementation

- `ACHIEVEMENTS_CONFIG`: `Record<AchievementId, AchievementDefinition>` — name, description, check function signature
- `checkAndUnlock(context: AchievementContext): AchievementId[]` — pure function; runs after every move; returns newly unlocked IDs
- Unlock notification: `AchievementToast` slides up from bottom of screen, shows achievement name + description, auto-dismisses in 3.5 seconds; queued if multiple unlock simultaneously
- Achievement gallery: grid of cards, locked ones show name but greyed description; unlocked show timestamp
- Progress indicators on partial achievements (e.g. 47/100 games played)

### Key Files

```
src/constants/achievements.constants.ts
src/store/achievementStore.ts
src/hooks/useAchievementChecker.ts
src/hooks/useAchievementQueue.ts
src/components/molecules/AchievementToast.tsx
app/achievements.tsx
```

### Definition of Done

- [x] No achievement can unlock twice — idempotent unlock logic verified
- [x] Achieving multiple at once queues toasts; second toast appears only after first dismisses
- [x] Achievement state survives an app reinstall via Android backup

---

## P-13 · Theme System & Unlockables

**Category:** Features  
**Timeline:** Weeks 9–10  
**Objective:** Elevate visual personalization to a premium differentiator — themes feel genuinely distinct, not just color-swapped versions of each other.

### Free Themes (3)

**Classic**
Warm cream (#FAF8EF) background, tan board, the recognizable 2048 palette elevated with better typography and spacing. System dark mode can override to Dark automatically.

**Dark**
Near-black (#111118) surface, subtle board definition via slightly lighter shade, tile colors fully desaturated and cooled. Comfortable for extended night play.

**Midnight**
Deep navy (#0A0F2E) surface, indigo board, tiles shift from cool steel at low values to vivid electric blue at 2048. Dramatic and premium.

### Premium Themes (2, IAP)

**Obsidian**
Pure black (#0A0A0A) surface, graphite board, tiles in a slate-to-electric progression. The 2048 tile is pure white text on electric blue — dramatic and minimal.

**Ivory**
Warm off-white (#FEFEF4) surface, barely-there board (#E8E6DE), pastel tiles with soft watercolor tints. Gentle and premium.

### Theme Picker

- 5 theme cards in a 2-column grid; each shows a live 2x2 mini board preview
- Premium themes show a lock indicator until purchased
- Tapping a locked premium theme previews it for 5 seconds then opens the IAP purchase sheet
- Theme switch is instant — no animation, no reload, synchronous token swap via `ThemeContext`

### Key Files

```
src/styles/themes/          (5 theme files)
src/context/ThemeContext.tsx
src/hooks/useTheme.ts
src/components/molecules/ThemePreviewCard.tsx
app/themes.tsx
```

### Definition of Done

- [x] Switching between all 5 themes mid-game produces no visual artifacts on tile positions or animation state
- [x] Premium theme previews work even without a purchase — auto-revert after 5 seconds
- [x] System dark mode toggle changes the game theme immediately without app restart

---

## P-14 · Screen Architecture

**Category:** Board UI  
**Timeline:** Week 10  
**Objective:** Wire all screens together with Expo Router — every screen is thin, every navigation transition is smooth, and the game board is never recreated on navigation.

### Screen Inventory

| File | Responsibility |
|------|---------------|
| `app/_layout.tsx` | `GestureHandlerRootView`, `ThemeProvider`, font loading, safe area config, Crashlytics init |
| `app/index.tsx` | Game screen — composes `GameHeader` + `GameBoard` + `GameControls` + mode selector; imports `useGameEngine`; zero game logic inline |
| `app/statistics.tsx` | Statistics display; bottom sheet style on Android |
| `app/achievements.tsx` | Achievement gallery grid; achievement progress bars |
| `app/settings.tsx` | Theme section, gameplay section (haptics, sound, undo limit), info section (rate app, privacy, licenses, version) |
| `app/themes.tsx` | Theme picker; accessible via settings |
| `app/about.tsx` | Version, build number, credits, link to privacy policy |

### Navigation Design

- Bottom navigation bar: Game (home), Statistics, Achievements — always visible
- Settings accessible via gear `IconButton` in `GameHeader` — pushes a full-screen sheet
- Game board is not unmounted when navigating to Statistics or Achievements — use `keepAlive` to preserve board state
- Screen transitions: platform-default slide on Android; no custom transitions to avoid JS-thread cost
- Deep links: `mergefinity://game`, `mergefinity://statistics`, `mergefinity://achievements`
- Safe area handling: all screens use `useSafeAreaInsets`; no hardcoded status bar height

### Definition of Done

- [x] Navigating to Statistics and back to Game never resets the board or score
- [x] All screens render correctly behind the system status bar on notch devices
- [x] Settings screen is accessible within 2 taps from the game screen

---

## P-15 · Audio & Haptics Polish

**Category:** Features  
**Timeline:** Weeks 10–11  
**Objective:** Layer in audio that rewards the player without ever feeling intrusive — restrained, well-timed, and immediately silenceable.

### Sound Design

| Asset | Description |
|-------|-------------|
| `tile_slide.wav` | Soft, low-pitched whoosh — distinct pitch per direction |
| `tile_merge_low.wav` | Deeper resonant tone for merges below 128 |
| `tile_merge_high.wav` | Cleaner, brighter tone for merges 128 and above |
| `win_chime.wav` | A short, elegant 3-note chime — not triumphant or cartoon-like |
| `game_over.wav` | A single low descending note — final but not harsh |
| `achievement_unlock.wav` | A crisp single-note ping |

All assets under 50KB each; `.wav` format for cross-device reliability.

### Audio Implementation

- `expo-av` for audio playback; sounds pre-loaded at app start via `SoundManager.preload()`
- `SoundManager` (`utils/sound.utils.ts`): singleton class; `play()`, `preload()`, `setEnabled()`; all calls gated by `settingsStore.soundEnabled`
- Audio ducks when the device is on silent mode
- Sounds triggered from store middleware, not from components or hooks
- No background music — deliberate premium decision; does not compete with the player's own audio

### Key Files

```
src/utils/sound.utils.ts
src/assets/sounds/            (6 audio files)
src/store/middleware/audio.middleware.ts
```

### Definition of Done

- [x] Audio disabled toggle in settings silences all sounds within the current gesture
- [x] Audio does not play when the device is in silent mode on iOS
- [x] Sound playback introduces zero perceptible latency on a mid-range Android device

---

## P-16 · Monetization

**Category:** Monetization  
**Timeline:** Weeks 11–12  
**Objective:** Build a monetization layer that sustains the game without degrading the experience — ads are respectful, IAPs are genuinely valuable.

### Ad Strategy

- Interstitial ad on game over — triggers only every 3rd game over, never on first session, never when the player just won
- Banner ad on Statistics and Achievements screens only — never on the game screen itself
- All ads hidden immediately when Remove Ads IAP is purchased (`purchaseStore.hasRemovedAds`)
- GDPR consent handled via Google UMP SDK on first launch in affected regions
- Ad unit IDs stored in `constants/ads.constants.ts` — never hardcoded inline
- Interstitial pre-loaded after every game start so it is ready instantly on game over

### IAP Products

| Product ID | Price | Description |
|------------|-------|-------------|
| `com.mergefinity.removeads` | $1.99 | Removes all ads permanently |
| `com.mergefinity.themebundle` | $2.99 | Unlocks Obsidian and Ivory themes |

- Restore Purchases button in settings: re-queries entitlements and updates `purchaseStore`
- Purchase UI: bottom sheet with loading spinner during processing; success toast on completion
- `purchaseStore` syncs on app foreground (`AppState` listener) to catch cross-device purchases

### Key Files

```
src/constants/ads.constants.ts
src/store/purchaseStore.ts
src/hooks/useAds.ts
src/hooks/usePurchase.ts
src/components/molecules/PurchaseSheet.tsx
src/utils/iap.utils.ts
```

### Definition of Done

- [x] Interstitial never appears when a player just reached 2048 for the first time
- [x] Purchasing Remove Ads and force-closing immediately before acknowledgement does not result in a charged but un-applied state
- [x] GDPR consent flow completes before any personalized ad is shown

---

## P-17 · Performance Audit

**Category:** Foundation  
**Timeline:** Week 12  
**Objective:** Guarantee 60fps on a mid-range Android device (Moto G Power or Samsung Galaxy A32) under all game conditions before any testing begins.

### Performance Targets

| Metric | Target |
|--------|--------|
| Frame rate | Sustained 60fps; no frame drops below 50fps during animation |
| JS thread during animation | Zero JS work between `gesture.onEnd` and animation complete |
| Cold start time | App interactive within 2 seconds on target device |
| JS bundle size | Under 5MB gzipped (Hermes enabled) |
| Memory | No leaks detectable after 30 game cycles |

### Optimization Checklist

- [x] Hermes enabled in `app.json` (`jsEngine: 'hermes'`)
- [x] All `console.log` replaced with a `__DEV__`-gated logger utility or removed entirely
- [x] All image assets run through `pngquant` / `oxipng` for compression
- [x] No unused packages remaining in `package.json`
- [x] `InteractionManager.runAfterInteractions` wrapping all post-animation store writes
- [x] `useMemo` on all board-derived computations (`emptyCells`, `tilePositions`)
- [x] `useCallback` on all event handlers passed as props down the tree
- [x] `useEffect` cleanup verified for every subscription, interval, and event listener

### Key Files

```
src/utils/logger.utils.ts
docs/PERFORMANCE_BASELINE.md
```

### Definition of Done

- [ ] Systrace recording of 50 swipes on target device shows zero JS thread frames exceeding 16ms
- [ ] 30-game memory test shows flat memory after initial load (no upward trend)
- [ ] Cold start measured at under 2 seconds on Moto G Power (3 runs averaged)

---

## P-18 · Testing Suite

**Category:** Foundation  
**Timeline:** Weeks 12–13  
**Objective:** Build a test suite that actually catches regressions — focused on the engine (100% coverage) and the critical interaction paths.

### Unit Tests (Jest)

- `engine/*`: 100% statement coverage — every function, every edge case
- Store actions: `move` (valid, blocked, win-trigger, loss-trigger), `undo` (empty history, max history), `restart` (preserves bestScore)
- `statsStore`: stats update correctly after win, after loss, after game over without completion
- `achievementStore`: Purist unlocks only on 0-undo win; Veteran does not double-count
- Constants: `TILE_COLORS` covers every `CellValue` in the `CellValue` union type
- Pure utils: `sound.utils`, `haptics.utils`, `storage.utils` — all public functions

### Integration & E2E

- Component tests via `@testing-library/react-native`: `GameBoard` renders 16 cells; `GameOverOverlay` appears when `status` is `'lost'`; `ScorePanel` updates when score changes
- Full game simulation test: programmatically swipe a seeded board to completion and assert final score, board state, and game status
- E2E via Maestro: new game flow, swipe left 5 times, verify score > 0, trigger game over, press Try Again, verify board resets

### Device Testing Matrix

| Device | Android Version |
|--------|----------------|
| Samsung Galaxy A32 | Android 13 |
| Pixel 6a | Android 14 |
| OnePlus Nord CE | Android 12 |
| Xiaomi Redmi Note 11 | Android 11 |
| Moto G Power | Android 11 |

### Key Files

```
src/engine/*.test.ts          (full coverage)
src/store/*.test.ts
src/components/**/*.test.tsx
e2e/game_flow.yaml            (Maestro)
docs/DEVICE_TEST_MATRIX.md
```

### Definition of Done

- [ ] `npx jest` shows 100% coverage on `engine/` and 85%+ on `store/`
- [ ] Maestro E2E passes on all 5 device types without flakiness across 3 consecutive runs
- [ ] TalkBack user can start a new game and identify the current score without sighted assistance

---

## P-19 · Pre-launch Polish & Store Assets

**Category:** Launch  
**Timeline:** Weeks 13–14  
**Objective:** Ensure the first impression — app icon, splash, onboarding, and store listing — is as polished as the game itself.

### In-App Polish

- **App icon:** tile-inspired; the letterform M formed from two merged tiles; clean and recognizable at 48x48dp; adaptive icon with foreground + background layers for Android
- **Splash screen:** single centered M logotype on board background color; no animation; visible for maximum 800ms before JS bundle is ready
- **Onboarding:** first-launch only; a single screen showing a swipe gesture demo (animated arrows over a static board); dismisses on first actual swipe — not a button
- **Error boundary:** wraps the game screen; catches render errors and shows a minimal restart prompt rather than a white screen
- No permission requests on first launch — ads consent only, after a complete first game
- Changelog screen accessible from about page

### Store Assets

| Asset | Specification |
|-------|--------------|
| Screenshots | 8 on Pixel 6 Pro device frame: game screen (Classic), game screen (Dark theme), win state, statistics, achievements, challenge mode, theme picker, time attack |
| Feature graphic | 1024x500; board showing 2048 tile achieved in Classic theme; game name in Space Grotesk Bold |
| Store title | Mergefinity — Number Puzzle (49 char limit) |
| Short description | The refined number merging puzzle. Reach 2048 and beyond. |
| Privacy policy | Hosted at `mergefinity.app/privacy` — covers analytics, ads, no account required |

Long description: 3 paragraphs; no bullet points; conversational; mentions 4 modes, 5 themes, 20 achievements; ASO-optimized for "2048 puzzle", "number merge game", "merge tiles".

### Key Files

```
assets/icon.png              (1024x1024)
assets/icon-adaptive-fg.png
assets/icon-adaptive-bg.png
assets/splash.png
docs/STORE_LISTING.md
docs/screenshots/            (8 files)
```

### Definition of Done

- [ ] Internal test build passes Google Play's pre-launch report with zero critical issues
- [ ] App icon legible at 48x48dp on a low-DPI screen and at 512x512 on the Play Store
- [ ] Onboarding never appears after the first session — verified by uninstall/reinstall test

---

## P-20 · Launch & Post-Launch Roadmap

**Category:** Launch  
**Timeline:** Weeks 14–15 and beyond  
**Objective:** Ship confidently with a staged rollout, then iterate based on real player data — not assumptions.

### Launch Process

- EAS production build submitted to Play Store: `.aab` format, signed with upload keystore stored in EAS secrets
- Internal testing track: team dogfoods for 3 days post-submission; zero P0 bugs before production promotion
- **Staged rollout:** 10% on day 1 → 25% on day 3 (if crash-free sessions >99%) → 50% on day 5 → 100% on day 7
- Firebase Analytics events verified live in DebugView before 100% rollout
- Version `1.0.0` tag in git; release notes in `CHANGELOG.md`
- Crashlytics: email alerts configured for crash rate spikes above 1%

### Analytics Events

| Event | Trigger |
|-------|---------|
| `game_start` | New game begins |
| `game_over` | Loss state reached |
| `win_achieved` | 2048 (or mode target) reached |
| `tile_reached` | Each new maximum tile value per session |
| `undo_used` | Undo action dispatched |
| `theme_changed` | Theme switched |
| `iap_initiated` | Purchase sheet opened |
| `iap_completed` | Successful purchase acknowledged |

### Post-Launch Roadmap

| Version | Timeline | Feature |
|---------|----------|---------|
| v1.1 | 2 weeks post-launch | Daily Challenge — one board per day; board seed derived from date so all players share the same starting position |
| v1.2 | 6 weeks post-launch | Share Score — generate a shareable image of the final board state with score overlay; native share sheet |
| v1.3 | 10 weeks post-launch | iOS release — Expo managed workflow means minimal platform-specific work |
| v1.4 | 12 weeks post-launch | Leaderboard — Firebase Realtime Database + optional Google Play Games sign-in; weekly top 100 per mode |
| v2.0 | 6 months post-launch | Multiplayer race mode consideration — both players, shared seed, first to 2048 wins; validate with retention data before committing |

### Key Files

```
CHANGELOG.md
docs/POST_LAUNCH_ROADMAP.md
docs/ANALYTICS_EVENTS.md
```

### Definition of Done

- [ ] Crash-free sessions rate above 99.5% on day 1 of production rollout
- [ ] All 8 Analytics events verified as flowing in Firebase DebugView within the first hour of rollout
- [ ] Play Store rating prompt appears correctly after a player's 3rd win (and not before)

---

## Key Technical Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| Board representation | Flat `CellValue[]` array, row-major | Enables O(1) index math; no nested array traversal; simplifies rotation algorithm |
| Animation library | Reanimated 3 only — no RN Animated | UI-thread execution guarantees 60fps; worklet compilation eliminates bridge crossings |
| State management | Zustand 5 with persist + devtools | Minimal boilerplate; `subscribeWithSelector` prevents over-rendering; tiny bundle footprint |
| Direction algorithm | Single left-shift + board rotation | One algorithm to maintain instead of four; direction logic collapses to a rotation lookup table |
| Navigation | Expo Router 3 (file-based) | Eliminates navigation boilerplate; deep links automatic; screen components are just files |
| Theme storage | TypeScript token objects, no CSS vars | React Native has no CSS cascade; full type safety on every token; theme switching is a context update |
| No emoji in UI | Icon glyphs + typographic markers only | Emoji render inconsistently across Android OEMs; typographic treatment reads as premium, not casual |
| Tile identity | Stable IDs across moves (not position-keyed) | Allows Reanimated shared values to persist through repositioning; prevents animation reset on every render |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Reanimated 3 upgrade breaks on a new Expo SDK version | Medium | High | Pin Reanimated version; only upgrade with a dedicated regression test pass |
| 60fps target not achievable on very low-end Android (< Snapdragon 400) | Medium | Medium | Define minimum spec (Android 10+, 2GB RAM); reduce animation complexity on detected low-end via DeviceInfo |
| Google Play IAP receipt validation delays causing blank purchase state | Low | High | Acknowledge purchases client-side immediately; validate server-side asynchronously; never gate access on validation completing |
| Board rotation algorithm produces incorrect results for asymmetric positions | Low | High | Engine unit tests include 40+ asymmetric board fixtures with known outputs; fuzzing test runs 10,000 random moves |
| AsyncStorage corruption on app kill during write | Low | Medium | Only persist non-critical state (bestScore, settings); validate schema on read and reset to defaults if malformed |
| Gesture direction misidentified on low-sensitivity touchscreens | Medium | Medium | Tune `SWIPE_MIN_DISTANCE` and `SWIPE_VELOCITY_THRESHOLD` constants per device in QA; expose advanced sensitivity option in settings |

---

*Mergefinity Game Plan · v1.0 · Generated for Cursor AI reference*
