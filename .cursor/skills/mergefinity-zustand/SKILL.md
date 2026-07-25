---
name: mergefinity-zustand
description: >-
  Zustand store patterns for Mergefinity — middleware stack, persist partialize,
  analytics wrapper, and AsyncStorage keys. Use when editing src/store/,
  persistence, or game actions (move/undo/restart).
---

# Zustand Store

## When to use

Editing `src/store/`, persist config, or store actions.

## Middleware order

```
devtools( persist( analytics( storeImpl ), persistConfig ), devtoolsConfig )
```

## Persist

- Keys: `STORAGE_KEYS` with `mergefinity:` prefix
- `partialize`: only `bestScore` (and settings/theme when added)
- Never persist active board, score, status, history, animations

## Actions

- `move(dir)` → `resolveMove` → if changed → `spawnTile` → update score/history
- `undo` — restore last of max 5 snapshots
- `restart` — keep `bestScore`
- Always `get()` inside actions

## Details

See [reference.md](reference.md) and SK-05/SK-08 in `docs/cursor/cursor_skills.md`.
