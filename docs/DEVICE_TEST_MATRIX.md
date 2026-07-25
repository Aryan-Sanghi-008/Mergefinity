# Device Test Matrix (P-18)

Manual / Maestro verification matrix for Mergefinity. Fill results on hardware or cloud devices — do not invent pass marks.

## Target devices

| Device | Android Version | Maestro | TalkBack smoke | Notes |
|--------|-----------------|---------|----------------|-------|
| Samsung Galaxy A32 | 13 | pending | pending | |
| Pixel 6a | 14 | pending | pending | |
| OnePlus Nord CE | 12 | pending | pending | |
| Xiaomi Redmi Note 11 | 11 | pending | pending | |
| Moto G Power | 11 | pending | pending | |

## Maestro flow

Flow file: [`e2e/game_flow.yaml`](../e2e/game_flow.yaml)

### Run (local / CI)

```bash
# With a connected emulator or device and a debug/release install of Mergefinity:
maestro test e2e/game_flow.yaml
```

Repeat **3 consecutive runs** per device without flakiness before marking that device Pass.

### Flow steps (summary)

1. Launch app → Game tab
2. New Game (if needed)
3. Swipe left 5 times
4. Assert score > 0 (or board changed — see YAML assertions)
5. Reach / assert game over when applicable
6. Try Again → board resets

> Stub / Expo Go note: Until a native build with Maestro-friendly IDs ships, keep device cells `pending`. YAML uses accessibility labels from `STRINGS`.

## TalkBack checklist (manual)

Goal: a TalkBack user can start a new game and identify the current score without sighted assistance.

| Step | Expected announcement / action | Pass? |
|------|-------------------------------|-------|
| Focus game tab | Game / Play tab | |
| Focus New Game | `New game` (`A11Y_NEW_GAME`) | |
| Activate New Game | Board resets; focus remains usable | |
| Focus score | Score value announced (`ScoreValue` / SCORE label) | |
| Focus best | Best value announced | |
| Focus board | `Game board` (`A11Y_BOARD`) | |

## Jest coverage gates (in-repo DoD)

- Engine: 100% statements (enforced in `package.json` `coverageThreshold`)
- Store: ≥85% statements (enforced in `package.json` `coverageThreshold`)

```bash
npx jest --coverage --watchman=false
```

## P-18 DoD tracking

| Criterion | In-repo | Device |
|-----------|---------|--------|
| Jest engine 100% + store 85%+ | Done (coverageThreshold green) | — |
| Maestro on 5 devices × 3 runs | YAML + this matrix | Leave game-plan box open until filled |
| TalkBack new game + score | Labels + this checklist | Leave game-plan box open until filled |
