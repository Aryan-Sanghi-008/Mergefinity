# Analytics Events (P-20)

Canonical Firebase Analytics event catalogue for Mergefinity. Events are emitted from store middleware / IAP utils — never from the game engine or raw screen handlers (except purchase-sheet open, which is the sheet presentation chokepoint).

Until `google-services.json` is configured, the app uses a **stub** client (`src/utils/analytics.utils.ts`) that buffers events in memory and logs them in `__DEV__` (DebugView stand-in via `Analytics.getDebugEvents()`).

## Events

| Event | Trigger | Params |
|-------|---------|--------|
| `game_start` | `restart` or `setMode` creates a fresh session | `mode` |
| `game_over` | Session reaches loss | `mode`, `score`, `best_tile` |
| `win_achieved` | Session reaches win (mode target / timer) | `mode`, `score`, `best_tile` |
| `tile_reached` | New maximum tile value in the current session | `tile_value`, `mode` |
| `undo_used` | Successful undo | `mode` |
| `theme_changed` | Persisted theme switch | `theme` |
| `iap_initiated` | Purchase sheet becomes visible | `product_id` |
| `iap_completed` | Purchase stub acknowledges success | `product_id` |

## Verification (DebugView)

1. Build a development or internal track binary with Firebase config (when available).
2. Enable Analytics DebugView for the test device.
3. Within the first hour of rollout, confirm all eight events appear after exercising: new game, undo, theme change, reach a new tile peak, win, lose, open IAP sheet, complete IAP.
4. Against the stub: call `getAnalyticsDebugEvents()` after the same flows in Jest / Flipper logs.

## Wiring map

| Event | Source |
|-------|--------|
| Gameplay events | `src/store/middleware/analytics.middleware.ts` (`analyticsGame`) |
| Theme | `analyticsSettings` on `settingsStore` |
| IAP | `trackIapInitiated` / `purchase` in `src/utils/iap.utils.ts` |
| Bootstrap | `initAnalytics()` in `src/app/_layout.tsx` |

## Crashlytics

Stub client: `src/utils/crashlytics.utils.ts`. `GameErrorBoundary` records non-fatals via `recordCrashlyticsError`. Configure email alerts for crash-rate spikes **>1%** in the Firebase console (ops checklist — not in-repo).
