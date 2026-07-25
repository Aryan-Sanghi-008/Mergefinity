# Wireframe — Game

**Route:** `app/index` (home tab)  
**Mock:** [game.png](game.png)

## Regions (top → bottom)

```
┌─────────────────────────────────────┐
│ SAFE AREA                           │
│ ┌─────────┐ ┌─────────┐      [⚙]   │  GameHeader
│ │ SCORE   │ │ BEST    │             │
│ │ 1248    │ │ 4096    │             │
│ └─────────┘ └─────────┘             │
│                                     │
│ [Classic][Endless][Challenge][Time] │  ModeSelector (horizontal pills)
│                                     │
│ ┌─────────────────────────────────┐ │
│ │  ┌──┐ ┌──┐ ┌──┐ ┌──┐            │ │  GameBoard
│ │  │  │ │2 │ │  │ │4 │            │ │  8dp tiles · 3px gaps · 10dp board radius
│ │  └──┘ └──┘ └──┘ └──┘            │ │
│ │  ┌──┐ ┌──┐ ┌──┐ ┌──┐            │ │
│ │  │8 │ │  │ │16│ │  │            │ │
│ │  └──┘ └──┘ └──┘ └──┘            │ │
│ │  … 4×4 grid …                   │ │
│ └─────────────────────────────────┘ │
│                                     │
│     [ New Game ]    [ Undo  3 ]     │  ControlBar
│                                     │
├─────────────────────────────────────┤
│  (•) Game   Stats   Achievements    │  Bottom tabs
└─────────────────────────────────────┘
```

## Hierarchy

1. Brand presence is the board + score — not a marketing headline
2. Mode pills above board; switching with an active game → soft restart confirm
3. Controls below board; Undo disabled + muted when history empty or limit reached
4. Settings only via header gear (pushes Settings)

## Overlays (same screen)

- **Win:** dimmed scrim; Keep Going / New Game
- **Game over:** dimmed scrim; Try Again / New Game
- **Score delta:** floating `+N` near SCORE (does not shift layout)

## TalkBack (minimum)

| Control | Label |
|---------|-------|
| Score panel | `Score {n}` |
| Best panel | `Best {n}` |
| Settings gear | `Settings` |
| Mode pill | `{mode name}` (selected state announced) |
| Board | `Game board` (tiles: `{value}` or `empty`) |
| New Game | `New game` |
| Undo | `Undo, {remaining} remaining` or `Undo unavailable` |
| Tab Game | `Game, tab` |

## Non-goals

- No stats or achievement lists on this screen
- No theme swatches here (Settings → Themes)
