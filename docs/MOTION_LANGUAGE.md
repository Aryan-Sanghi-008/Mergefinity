# Mergefinity — Motion Language

> P-00. Specs align with game plan P-07; constants live later in `animation.constants.ts` / `src/styles/animations.ts`.

---

## Principles

1. **Spring-physics-based** where the player should feel mass (merge pop, spawn). Timing curves for pure translation (slide).
2. **Sub-200ms slides** — board response feels immediate; never wait on decorative chrome.
3. **Tactile merge pop** — brief overshoot, then settle; satisfying, not bouncy UI chrome.
4. **No bouncing chrome** — headers, buttons, nav, overlays do not spring-bounce; overlays use short opacity + slight translate.
5. **UI-thread only** for tile transforms (Reanimated); zero JS work during the swipe gesture itself.

---

## Core board animations

| Animation | Feel | Spec (from P-07) |
|-----------|------|------------------|
| Tile slide | Snappy ease-out | `translateX`/`Y` with `withTiming` + `Easing.out(Easing.quad)`; **~120ms** (`SLIDE_DURATION_MS`) |
| Merge pop | Tactile punch | After slide: scale `1 → 1.15` (~60ms) then spring back to `1` (`damping: 12`, `stiffness: 200`) |
| New tile spawn | Soft appear | Scale `0 → 1` with spring; opacity `0 → 1`; after slide + merge; optional stagger via `SPAWN_DELAY_MS` |
| Score delta float | Brief reward | `+N` at score panel, rises ~40dp, fades ~600ms |
| Score counter roll | Continuity | Score numeral interpolates; not an instant snap |
| Board edge pulse | Blocked move | Board **border** flashes accent and fades — primary no-op feedback (not full-board shake) |
| Game over / win overlay | Calm | Opacity `0→1`, `translateY` `20→0`, ~300ms timing; win may add a brief scale overshoot on the card only |

---

## Sequencing

```
swipe accepted
  → ANIMATION_LOCK = true
  → slide phase (all moving tiles)
  → merge pop phase
  → spawn phase
  → ANIMATION_LOCK = false
```

Gestures ignore input while `ANIMATION_LOCK` is true.

---

## What not to animate

- Layout thrash of the bottom nav or header on every move
- Confetti, particle fireworks, emoji bursts
- Endless looping idle animations on the board
- Parallax or 3D flips of the whole board

---

## Haptics (pairing, not motion)

Light impact on successful merge; softer tick on spawn optional; distinct short warning on blocked move (with edge pulse). Exact `expo-haptics` mapping lands in P-15; motion must still read without haptics.

---

## Reduced motion

When the OS reduced-motion preference is on: keep position updates correct; shorten or skip decorative float/overshoot; prefer opacity fades over large springs for overlays.
