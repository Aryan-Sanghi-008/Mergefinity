# Performance Baseline (P-17)

Mergefinity performance targets, code checklist status, and device measurement procedures.

## Targets

| Metric | Target |
|--------|--------|
| Frame rate | Sustained 60fps; no frame drops below 50fps during animation |
| JS thread during animation | Zero store writes between gesture settle and animation complete (`InteractionManager.runAfterInteractions` around `commitMove`) |
| Cold start | App interactive within 2 seconds on target device |
| JS bundle size | Under 5MB gzipped (Hermes enabled) |
| Memory | No leaks detectable after 30 game cycles |

## Code checklist status

| Item | Status | Notes |
|------|--------|-------|
| Hermes in `app.json` (`jsEngine: 'hermes'`) | Done | Root + android + ios |
| `console.log` → `__DEV__` logger / removed | Done | No bare `console.*` in `src/`; use `src/utils/logger.utils.ts` |
| Image assets compressed | N/A (stubs) | Current `src/assets/images/*.png` are 1×1 placeholders. Compress production art with `oxipng` / `pngquant` before store release |
| No unused packages | Audited | `expo-keep-awake` wired on game tab; `expo-linking` / `expo-font` / `react-dom` retained for Expo Router / web |
| `InteractionManager.runAfterInteractions` on post-anim store writes | Done | `useGameEngine` defers `commitMove` + follow-up after animation delays |
| `useMemo` on board-derived layout (`cellOffsets` / tile positions) | Done | `useBoardDimensions` + `GameBoard` cell styles / indices |
| `useCallback` on prop handlers | Done | Game / mode / settings handlers already stable |
| `useEffect` cleanup | Done | AppState, focus keep-awake, toast, countdown, ads consent, theme preview |

## Device measurement procedures

Run on mid-range Android (Moto G Power or Samsung Galaxy A32). Record results in the table below — do not invent numbers.

### Systrace — 50 swipes

1. Build a release or profile variant with Hermes.
2. Start Systrace / Perfetto focused on the JS / UI threads.
3. Perform 50 valid swipes on a Classic board (mix of merges and slides).
4. Confirm no JS thread frames exceed 16ms during the animation window after each gesture.

### Memory — 30 game cycles

1. Attach Android Studio Memory Profiler (or equivalent).
2. Play or script 30 full games (new game → play to win or lose → restart).
3. After the initial load spike, heap / PSS should be flat (no upward trend).

### Cold start — 3-run average

1. Force-stop the app; clear from recents.
2. Cold-launch and measure time to interactive game screen (board visible, swipeable).
3. Repeat 3 times; average must be under 2 seconds on Moto G Power.

## Device results (fill in on hardware)

| Metric | Device | Result | Pass? | Date |
|--------|--------|--------|-------|------|
| Systrace 50 swipes (JS >16ms frames) | | _pending_ | | |
| 30-game memory trend | | _pending_ | | |
| Cold start average (3 runs) | Moto G Power | _pending_ | | |

## Implementation notes

- Hermes: explicit `jsEngine: "hermes"` in `app.json`.
- Post-animation commits: `InteractionManager.runAfterInteractions` in `src/hooks/useGameEngine.ts`.
- Keep-awake: `activateKeepAwakeAsync` / `deactivateKeepAwake` via `useFocusEffect` on the game tab.
- Logger: `src/utils/logger.utils.ts` (`logger.debug|info|warn|error`).
