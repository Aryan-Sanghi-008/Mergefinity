# Mergefinity — Design Brief

> P-00 pre-production. Every visual decision in later phases references this document and its siblings (`TYPOGRAPHY.md`, `TILE_COLOR_MAP.md`, `MOTION_LANGUAGE.md`).

---

## Brand personality

**Mergefinity** is refined, minimal, and deeply satisfying.

| Do | Don't |
|----|-------|
| Quiet confidence; premium puzzle craft | Cartoon affect, mascots, sticker clutter |
| Tactile feedback through motion and haptics | Emoji, confetti explosions, celebration spam |
| Clear hierarchy; one job per screen region | Dashboard density; competing chrome |
| Warm cream → electric gold at 2048 (Classic) | Generic purple/neon “AI default” palettes |
| Readable tile numerals at every magnitude | Decorative fonts that fail at 5 digits |

Tone of voice (UI copy): sentence case, short, instructional. No hype adjectives in chrome labels.

---

## Board treatment (authoritative for P-00)

| Token | Value | Notes |
|-------|-------|-------|
| Tile corner radius | **8dp** | Soft but geometric; not pill-shaped |
| Gap between cells | **3px** | Tight grid; density over airy “card” feel |
| Board outer radius | **10dp** | Slightly larger than tiles so the board reads as a single vessel |
| Tile elevation / drop shadow | **None** | Flat tiles; depth comes from color steps and motion only |
| Board surface | Theme `BOARD_BG` | Classic tan `#BBADA0`; see theme surfaces below |

### Theme surfaces (free trio — paper reference)

| Theme | Surface | Board |
|-------|---------|-------|
| Classic | `#FAF8EF` | `#BBADA0` |
| Dark | `#111118` | muted cooler gray (see `TILE_COLOR_MAP.md`) |
| Midnight | `#0A0F2E` | indigo board (see `TILE_COLOR_MAP.md`) |

Premium themes (Obsidian, Ivory) are specified in the game plan P-13; not required for P-00 paper DoD.

---

## Resolved product decisions (P-00 open → locked)

Locked from later phases in `MERGEFINITY_GAME_PLAN.md` (same document — no invented scope).

| Decision | Resolution | Source |
|----------|------------|--------|
| Score feedback | **Both** floating `+N` delta **and** score counter roll | P-07 |
| Blocked / no-op move | **Board edge pulse** (border flashes accent, fades) — not full-board shake as primary UX | P-07 |
| Undo limits | Classic & Endless: **3**/game; Challenge: **1**; Time Attack: **unlimited**; IAP may unlock unlimited undos | P-09 / P-10 / P-00 monetization intent |

Detail for motion feel: [`MOTION_LANGUAGE.md`](MOTION_LANGUAGE.md).

---

## Screen inventory (wireframes)

Approved layout sources (markdown = layout truth; PNG = low-fi mock):

| Screen | Markdown | PNG |
|--------|----------|-----|
| Game | [`wireframes/game.md`](wireframes/game.md) | [`wireframes/game.png`](wireframes/game.png) |
| Settings | [`wireframes/settings.md`](wireframes/settings.md) | [`wireframes/settings.png`](wireframes/settings.png) |
| Statistics | [`wireframes/statistics.md`](wireframes/statistics.md) | [`wireframes/statistics.png`](wireframes/statistics.png) |
| Achievements | [`wireframes/achievements.md`](wireframes/achievements.md) | [`wireframes/achievements.png`](wireframes/achievements.png) |
| Theme picker | [`wireframes/theme-picker.md`](wireframes/theme-picker.md) | [`wireframes/theme-picker.png`](wireframes/theme-picker.png) |

Navigation (from game plan P-14): bottom bar — Game / Statistics / Achievements; Settings via gear in game header; Themes via Settings.

---

## Accessibility brief

| Requirement | Spec |
|-------------|------|
| Contrast | Tile numeral vs tile background ≥ **4.5:1** (WCAG AA) for all mapped values in Classic, Dark, Midnight — verify in `TILE_COLOR_MAP.md` |
| Tap targets | Interactive controls ≥ **44×44dp** (IconButton, PrimaryButton, bottom nav items, mode pills) |
| TalkBack | Every interactive element has an accessibility label; tiles expose value; score/best announce on change when focused; overlays announce win/loss state |
| Motion | Respect reduced-motion preference where platform allows (shorten or skip non-essential overlays; keep slide completion deterministic) |
| Color alone | Win/loss/locked states must not rely on color only (copy + icon glyph — no emoji) |

---

## P-04 token reconciliation note

Game plan **P-04** locks `TILE_RADIUS` **6dp**, `TILE_GAP` **8dp**, and tile/board elevation (**2** / **4**). Those values are now implemented in `src/styles/spacing.ts` and theme elevation tokens, superseding the earlier P-00 paper board treatment (8dp / 3px / no elevation) for the shipped token layer.


---

## Definition of done (P-00)

- [x] This brief + sibling docs exist under `docs/`
- [x] Wireframes signed off for layout (see `wireframes/README.md`)
- [x] Tile progressions for Classic / Dark / Midnight through 131072 documented on paper
