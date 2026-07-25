# Wireframe — Statistics

**Route:** tab `statistics`  
**Mock:** [statistics.png](statistics.png)

## Regions

```
┌─────────────────────────────────────┐
│  Statistics                         │
│  [Classic][Endless][Challenge][Time]│  Mode tabs
├─────────────────────────────────────┤
│  Games played                 128   │  StatRow
│  Wins                          41   │
│  Best score                  8192   │
│  Average score               1240   │
│  Total moves                18420   │
│  Longest streak                 6   │
│  …                                  │
├─────────────────────────────────────┤
│  Game   (•) Stats   Achievements    │
└─────────────────────────────────────┘
```

## Hierarchy

1. Title + mode filter (stats are per-mode)
2. Single-column label / value rows — value right-aligned
3. Empty state: “Play a game in this mode to see stats.”

## TalkBack

| Control | Label |
|---------|-------|
| Mode tab | `{mode}, {selected|}` |
| Stat row | `{label}, {value}` |

## Non-goals

- No charts in P-00 layout (keep rows only unless game plan amends)
- Board must not remount when returning to Game (P-14 keepAlive)
