# Wireframe — Settings

**Route:** `app/settings` (pushed from Game header gear)  
**Mock:** [settings.png](settings.png)

## Regions

```
┌─────────────────────────────────────┐
│ [←]  Settings                       │
├─────────────────────────────────────┤
│ THEME                               │
│  Current: Classic            [ > ]  │  → Theme picker
│  System dark mode    [====•]        │  toggle
├─────────────────────────────────────┤
│ GAMEPLAY                            │
│  Haptics             [====•]        │
│  Sound               [====•]        │
│  Undo limit          3 / Unlimited  │  reflects mode + IAP
├─────────────────────────────────────┤
│ INFO                                │
│  Rate app                    [ > ]  │
│  Privacy policy              [ > ]  │
│  Licenses                    [ > ]  │
│  Version 1.0.0                      │
└─────────────────────────────────────┘
```

## Hierarchy

1. Theme section first (highest visual impact)
2. Gameplay toggles second
3. Info / legal last; version as caption, not a button

## TalkBack

| Control | Label |
|---------|-------|
| Back | `Back` |
| Theme row | `Theme, {name}, opens theme picker` |
| System dark | `Match system dark mode, {on|off}` |
| Haptics / Sound | `{name}, {on|off}` |
| Undo limit | `Undo limit, {value}` (informational or opens detail if IAP) |

## Layout notes

- Full-screen sheet / stack push (P-14)
- Rows ≥ 44dp tall; toggles right-aligned
- No cards in the decorative sense — section headers + rows only
