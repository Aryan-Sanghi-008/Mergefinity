# Mergefinity — Tile Color Map

> P-00 paper reference for Classic, Dark, and Midnight. Values **0** (empty) through **131072**. Implement in P-04 theme files — do not edit `src/` in P-00.

**Contrast rule:** tile text vs tile background ≥ **4.5:1** (WCAG AA). Text choices below are chosen for that intent; verify in device/theme QA during P-04.

Cell values: `0 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384 | 32768 | 65536 | 131072`

---

## Classic

**Surfaces:** app `#FAF8EF` · board `#BBADA0`

Warm cream progression → **electric gold at 2048** → hot amber / near-white post-2048.

| Value | Background | Text | Notes |
|------:|------------|------|-------|
| 0 | `#CDC1B4` | transparent | Empty cell recess |
| 2 | `#EEE4DA` | `#776E65` | Cream start |
| 4 | `#EDE0C8` | `#776E65` | |
| 8 | `#F2B179` | `#F9F6F0` | Warm orange |
| 16 | `#F59563` | `#F9F6F0` | |
| 32 | `#F67C5F` | `#F9F6F0` | |
| 64 | `#F65E3B` | `#F9F6F0` | |
| 128 | `#EDCF72` | `#3C3A32` | Enter gold band; dark text for AA |
| 256 | `#EDCC61` | `#3C3A32` | |
| 512 | `#EDC850` | `#3C3A32` | |
| 1024 | `#EDC53F` | `#3C3A32` | |
| **2048** | `#EDC22E` | `#3C3A32` | **Electric gold summit** |
| 4096 | `#F0B429` | `#3C3A32` | Hot amber |
| 8192 | `#F5A623` | `#3C3A32` | |
| 16384 | `#FF9F1A` | `#3C3A32` | |
| 32768 | `#FFB347` | `#3C3A32` | |
| 65536 | `#FFE08A` | `#3C3A32` | Toward white-hot |
| 131072 | `#FFF6D6` | `#3C3A32` | Soft white-gold |

---

## Dark

**Surfaces:** app `#111118` · board `#1C1C24`

Desaturated, cooled tiles for night play. Low values = cool steel gray; mid = desaturated teal-slate; **2048** = muted cool gold; post-2048 brightens toward icy highlight.

| Value | Background | Text | Notes |
|------:|------------|------|-------|
| 0 | `#2A2A32` | transparent | |
| 2 | `#3A3A44` | `#E8E8EC` | |
| 4 | `#454550` | `#E8E8EC` | |
| 8 | `#4A5568` | `#F0F2F5` | Cooled slate |
| 16 | `#556273` | `#F0F2F5` | |
| 32 | `#5F6E82` | `#F0F2F5` | |
| 64 | `#6A7A8F` | `#F0F2F5` | |
| 128 | `#6B7F8A` | `#F5F7F8` | Desaturated teal-steel |
| 256 | `#738A8F` | `#0E1014` | Switch to dark text as tiles lighten |
| 512 | `#7E9690` | `#0E1014` | |
| 1024 | `#8AA48A` | `#0E1014` | |
| **2048** | `#C4B56A` | `#0E1014` | **Muted cool gold** |
| 4096 | `#A8B8C4` | `#0E1014` | Icy lift |
| 8192 | `#B8C8D4` | `#0E1014` | |
| 16384 | `#C8D6E0` | `#0E1014` | |
| 32768 | `#D6E2EA` | `#0E1014` | |
| 65536 | `#E4EEF4` | `#0E1014` | |
| 131072 | `#F0F6FA` | `#0E1014` | Near-white ice |

---

## Midnight

**Surfaces:** app `#0A0F2E` · board `#141B45`

Cool steel → **electric blue at 2048** → brighter cyan/white post-2048.

| Value | Background | Text | Notes |
|------:|------------|------|-------|
| 0 | `#1A2250` | transparent | Indigo recess |
| 2 | `#2A3470` | `#DCE4FF` | Steel start |
| 4 | `#343E80` | `#DCE4FF` | |
| 8 | `#3E4A98` | `#EEF2FF` | |
| 16 | `#4856B0` | `#EEF2FF` | |
| 32 | `#5262C4` | `#EEF2FF` | |
| 64 | `#5C6ED4` | `#EEF2FF` | |
| 128 | `#4A7AE0` | `#F5F8FF` | Toward electric |
| 256 | `#3D8AF0` | `#F5F8FF` | |
| 512 | `#2E9AFF` | `#061018` | Dark text as luminance rises |
| 1024 | `#1AA8FF` | `#061018` | |
| **2048** | `#00B4FF` | `#061018` | **Electric blue summit** |
| 4096 | `#33C4FF` | `#061018` | Cyan lift |
| 8192 | `#66D4FF` | `#061018` | |
| 16384 | `#99E2FF` | `#061018` | |
| 32768 | `#B8ECFF` | `#061018` | |
| 65536 | `#D6F4FF` | `#061018` | |
| 131072 | `#EEFAFF` | `#061018` | Soft ice |

---

## Paper check — progression story

| Theme | Low (2–16) | Mid (32–512) | Summit (2048) | Post (4096–131072) |
|-------|------------|--------------|---------------|---------------------|
| Classic | Cream → orange | Orange → gold | Electric gold `#EDC22E` | Amber → white-gold |
| Dark | Cool gray | Slate / desaturated teal | Muted cool gold `#C4B56A` | Ice toward white |
| Midnight | Indigo steel | Blue lift | Electric blue `#00B4FF` | Cyan → ice |

---

## Empty / chrome companions (quick ref)

| Token | Classic | Dark | Midnight |
|-------|---------|------|----------|
| `SURFACE` | `#FAF8EF` | `#111118` | `#0A0F2E` |
| `BOARD_BG` | `#BBADA0` | `#1C1C24` | `#141B45` |
| `CELL_EMPTY` | `#CDC1B4` | `#2A2A32` | `#1A2250` |
| Accent (edge pulse) | `#EDC22E` | `#C4B56A` | `#00B4FF` |

Obsidian / Ivory maps are out of P-00 DoD; define in P-04 / P-13.
