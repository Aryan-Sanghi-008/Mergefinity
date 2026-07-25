# Wireframe — Theme picker

**Route:** `app/themes` (from Settings → Theme row)  
**Mock:** [theme-picker.png](theme-picker.png)

## Regions

```
┌─────────────────────────────────────┐
│ [←]  Themes                         │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐    │
│  │ Classic              [✓]    │    │
│  │ [2][4]                      │    │  ThemePreviewTile 2×2
│  │ [8][2048]                   │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ Dark                        │    │
│  │ [preview]                   │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ Midnight                    │    │
│  │ [preview]                   │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ Obsidian            [IAP]   │    │
│  │ [preview] locked affordance │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ Ivory               [IAP]   │    │
│  │ [preview]                   │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

## Hierarchy

1. Free themes first (Classic, Dark, Midnight)
2. Premium themes after with clear IAP affordance (not color-only)
3. Selecting a free theme applies immediately; selected shows checkmark
4. Preview is a 2×2 mini board of theme tile colors (P-05 `ThemePreviewTile`)

## TalkBack

| Control | Label |
|---------|-------|
| Back | `Back` |
| Free theme row | `{name} theme, {selected|}, double tap to apply` |
| Locked theme | `{name} theme, locked, in-app purchase` |

## Non-goals

- No live full game board on this screen
- Purchase flow UI details deferred to P-16; show lock + IAP badge only
