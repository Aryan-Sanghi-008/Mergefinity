# CURSOR SKILLS REFERENCE
## Mergefinity · 2048-Style Android Game · React Native + TypeScript
### Companion to Frontend Engineering Rules · v1.0 · 2025

This document tells Cursor exactly which APIs to use, why they exist, and how to invoke them correctly.

---

## SK-01 TypeScript 6 & ESLint (flat config)

Required `tsconfig.json` settings: `strict`, `noImplicitAny`, `strictNullChecks`, `noUnusedLocals`, `noUnusedParameters`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `paths: { "@/*": ["src/*"] }`.

ESLint: `consistent-type-imports`, `no-explicit-any`, `import/no-default-export`, `import/order`, `no-magic-numbers`, `no-console`.

Use `satisfies` and `as const` on constants objects.

---

## SK-02 React Native & Expo SDK

- `StyleSheet.create()` at file bottom
- `Pressable` for all interactive elements
- `useWindowDimensions()` for board size (never `Dimensions.get()` in render)
- `Platform.select()` for shadow/elevation only
- `expo-haptics`, `expo-router`, `expo-font`, `AppState` for background pause

---

## SK-03 React Native Reanimated 4

All animations on UI thread: `useSharedValue`, `withTiming`, `withSpring`, `withSequence`, `useAnimatedStyle`, `runOnJS`, `cancelAnimation`. Worklets are provided by `react-native-worklets`; `babel-preset-expo` wires the plugin automatically (no manual reanimated babel plugin).

Constants: `SLIDE_DURATION_MS`, `MERGE_DURATION_MS`, `SPAWN_DURATION_MS`, `MERGE_SCALE`.

Never use RN Animated API.

---

## SK-04 React Native Gesture Handler 2

`Gesture.Pan()` with `minDistance` / `minVelocity`. Resolve direction in `onEnd` worklet; bridge via `runOnJS`. `GestureHandlerRootView` once in `app/_layout.tsx`.

---

## SK-05 Zustand

Middleware order: `devtools(persist(analytics(storeImpl)))`. Persist only `bestScore` / settings via `partialize`. Targeted selectors at call site. `get()` inside actions.

---

## SK-06 Game Engine Algorithms

| Function | Signature | Algorithm |
|----------|-----------|-----------|
| createEmptyBoard | `() → Board` | `Array(16).fill(0)` |
| getEmptyCells | `(b) → number[]` | indices where v===0 |
| spawnTile | `(b, rng?) → Board` | 2 @ 90% / 4 @ 10% |
| shiftRowLeft | `(row) → {row, delta}` | filter→merge→pad |
| rotateBoard | `(b, times) → Board` | 90° clockwise × times |
| resolveMove | `(b, dir) → MoveResult` | rotate→shiftLeft→rotate back |
| isWon / isLost | `(b) → boolean` | WIN_VALUE / no moves |

DIR_ROTATIONS: LEFT [0,0], RIGHT [2,2], UP [3,1], DOWN [1,3].

---

## SK-07 Testing

Engine 100% coverage. Co-located `*.test.ts`. Seeded rng. Freeze boards for immutability tests. Jest + `@testing-library/react-native`.

---

## SK-08 Storage & Haptics

AsyncStorage only via Zustand persist. Keys in `STORAGE_KEYS` with `mergefinity:` prefix. Haptics on merge in store action.

---

## SK-09 Design Tokens

`styles/theme.ts`, `styles/typography.ts`. No raw hex/font sizes in components. `getTileFontSize(value)`.

---

## SK-10 Monetization & Analytics

Ads/analytics isolated in store middleware. Engine never knows about ads. Events: `game_start`, `game_over`, `tile_reached`, `undo_used`.

---

## SK-11 Dependency Map

```
constants/ ← imported by everything; imports nothing internal
types/     ← imports constants only
engine/    ← constants + types only
store/     ← engine + constants + types
hooks/     ← store + engine + constants + types
components/← hooks + constants + types
app/       ← components + hooks only
```

Package lock targets: expo ~57, RN 0.86, React 19.2, Reanimated ~4 (+ react-native-worklets), Gesture Handler ~2.32, Zustand ^5, TypeScript ~6, Jest ^29 (jest-expo ~57), ESLint ^9 (flat config, eslint-config-expo ~57), @testing-library/react-native ^14.
