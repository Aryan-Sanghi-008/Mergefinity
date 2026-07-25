# Zustand Reference

## Storage keys

```ts
export const STORAGE_KEYS = {
  GAME_STATE: 'mergefinity:game_state',
  BEST_SCORE: 'mergefinity:best_score',
  SETTINGS: 'mergefinity:settings',
  THEME: 'mergefinity:theme',
} as const;
```

## Persist config

```ts
{
  name: STORAGE_KEYS.GAME_STATE,
  storage: createJSONStorage(() => AsyncStorage),
  partialize: (s) => ({ bestScore: s.bestScore }),
}
```

## Selector usage

```ts
const score = useGameStore((s) => s.score); // targeted
// never: const store = useGameStore();
```

## Analytics middleware

Wrap actions; fire `tile_moved`, `game_won`, `game_start` after original action. Engine stays unaware.
