# Mergefinity — Typography

> P-00. Implementation of font loading lands in later phases; this doc is the type contract.

---

## Families

| Role | Family | Weight | Used for |
|------|--------|--------|----------|
| UI chrome | **Inter** | Regular / Medium / SemiBold as needed | Labels, buttons, settings rows, stats, nav, body copy |
| Tile numerals | **Space Grotesk** | **Bold** | Cell values on the board only |

No other display fonts. No system default stacks in production UI once fonts are loaded (fallback: Inter → system sans during load only).

---

## Why these choices

- **Inter** — neutral, highly legible UI chrome at small sizes; pairs with a geometric display numeral without competing.
- **Space Grotesk Bold** — high-contrast, geometric digits; remains readable when tiles shrink to 4–5 characters (`65536`, `131072`).

---

## Tile numeral scale (by digit count)

Aligned with game plan P-04:

| Digits | Example values | Size |
|--------|----------------|------|
| 1–2 | 2 … 64 | **36sp** |
| 3 | 128 … 512 | **30sp** |
| 4 | 1024 … 8192 | **24sp** |
| 5 | 16384 … 131072 | **20sp** |

Tracking: default; do not letter-space tile numerals. Tabular lining figures if the font subset supports them.

---

## UI chrome scale (reference)

Exact tokens ship in P-04; P-00 locks hierarchy only:

| Role | Approx size | Weight |
|------|-------------|--------|
| Screen title | 20–22sp | SemiBold |
| Section header | 14–16sp | SemiBold |
| Body / row label | 14–16sp | Regular |
| Score value | 22sp | SemiBold |
| Score / BEST label | 10–11sp | Medium, muted, small caps or uppercase tracking |
| Caption / helper | 12sp | Regular |
| Bottom nav label | 11–12sp | Medium |

---

## Color of type

- Chrome text uses theme tokens (`TEXT_PRIMARY`, `TEXT_SECONDARY`, `TEXT_MUTED`) — never raw hex in components.
- Tile text colors are defined per value in [`TILE_COLOR_MAP.md`](TILE_COLOR_MAP.md) and must meet **4.5:1** against tile background.

---

## Non-goals

- Decorative / handwritten / emoji fonts
- Mixing more than two families on a screen
- Shrinking tile type below 20sp for 5-digit values (prefer scale table above)
