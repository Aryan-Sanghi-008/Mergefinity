# Wireframe — Achievements

**Route:** tab `achievements`  
**Mock:** [achievements.png](achievements.png)

## Regions

```
┌─────────────────────────────────────┐
│  Achievements              7 / 20   │  progress caption
├─────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐         │
│  │ [glyph]  │  │ [glyph]  │         │  2-column gallery
│  │ Name     │  │ Name     │         │
│  │ Desc…    │  │ locked…  │         │  locked: greyed description
│  │ Unlocked │  │          │         │  unlocked: timestamp
│  └──────────┘  └──────────┘         │
│  ┌──────────┐  ┌──────────┐         │
│  │ …        │  │ …        │         │
│  └──────────┘  └──────────┘         │
├─────────────────────────────────────┤
│  Game   Stats   (•) Achievements    │
└─────────────────────────────────────┘
```

## Hierarchy

1. Title + overall unlock count
2. Scrollable grid of achievement cards
3. Partial progress (e.g. 47/100) shown as text under description when applicable

## TalkBack

| Control | Label |
|---------|-------|
| Card unlocked | `{name}, {description}, unlocked {date}` |
| Card locked | `{name}, locked, {hint or progress}` |

## Non-goals

- No emoji in glyphs — abstract/icon marks only
- Toast unlock UI is overlay on Game (P-12), not this screen’s job
