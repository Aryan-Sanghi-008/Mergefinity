---
name: mergefinity-animation-gestures
description: >-
  Reanimated 4 and Gesture Handler patterns for Mergefinity tile slides, merges,
  and swipe detection. Use when editing animations, useAnimatedTile,
  useSwipeGesture, or GestureDetector wiring.
---

# Animation & Gestures

## When to use

Tile animation hooks, pan swipe handling, or Reanimated worklets.

## Hard rules

- Reanimated 4 only (worklets via react-native-worklets) — never RN Animated API
- Durations/scales from `animation.constants.ts`
- Gesture `onEnd` is a worklet; store dispatch via `runOnJS`
- `GestureHandlerRootView` once in `src/app/_layout.tsx`

## APIs

- Shared values: `translateX/Y`, `scale`, `opacity`
- Move: `withTiming` + `SLIDE_DURATION_MS`
- Merge: `withSequence(withTiming(MERGE_SCALE), withSpring(1))`
- Pan: `minDistance(SWIPE_MIN_DISTANCE)`, `minVelocity(SWIPE_VELOCITY_THRESHOLD)`

## Details

See [reference.md](reference.md) and SK-03/SK-04 in `docs/cursor/cursor_skills.md`.
