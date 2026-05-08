# ADR-0004: CHR tiles authored in-source, runtime palette baking

- **Status:** Accepted
- **Date:** 2026-05-07

## Context

The disassembly we port from (per [ADR-0001](0001-port-the-disassembly.md)) is logic + data only. Pixel art lives in the cartridge's CHR ROM (8 KB, 256 × 8×8 tiles, 2bpp planar) and is not reproduced in the disassembly. To render anything we need a CHR source.

Three options were considered:

1. **Extract CHR from a ROM dump.** Authentic, but gates progress on sourcing a ROM and ships a derivative work in the repo.
2. **Hand-author placeholder tiles in-source as 8-line string grids.** Each row is `"01230123"` style; chars `0`–`3` map to palette indices 0–3. A small decoder turns the strings into a greyscale offscreen canvas at boot.
3. **Hand-author tiles in code that draws into a canvas at boot (no asset).** Mixes pixel art into source as imperative draw calls — unreadable.

Option 2 unblocks the rendering pipeline today, keeps the repo asset-free and legally clean, and reduces to a one-file change when we later swap to a ROM-derived CHR (replace the in-source tile array with a PNG fetch; the bake step downstream is unchanged).

For palette handling: the NES PPU pairs every 8×8 tile with one of four sub-palettes at draw time, each sub-palette being four indices into a 64-entry master palette. We replicate this with **bake-on-palette-change**: on every area-palette transition, we render every CHR slot × every sub-palette into a single offscreen canvas, then per-frame draws are pure `drawImage` blits. Alternatives — recolouring per draw (`getImageData` per tile, unviable at 60 fps) and a WebGL palette-LUT shader (breaks the plain Canvas 2D stance in `CONTEXT.md`) — were rejected.

## Decision

- CHR tiles are authored in-source as 8-line `readonly string[]` grids in `src/data/chr-tiles.ts`. Chars `0`–`3` denote palette indices 0–3.
- A boot-time decoder composes these into one offscreen canvas of 256 × 8×8 slots filled with four greys (`0 / 85 / 170 / 255`). Unauthored slots are blank.
- On every area-palette change, we bake every CHR slot × every sub-palette into one larger offscreen canvas. Per-frame tile draws are pure `drawImage` blits from this baked sheet.
- The 64-entry NES master palette and per-area palettes live in `src/data/`.

## Consequences

- The slice that introduces this decision ships standalone — no ROM, no PNG asset, no extraction script, no new dependencies.
- Swapping to a ROM-derived CHR later is a single-file change: replace the in-source tile array (and its synchronous decoder) with an async PNG load. The bake step and everything downstream are unaffected.
- Starman's per-frame palette flicker (and any other dynamic recolour) is supported by re-baking the affected sub-palette on the same frame; cost is one row of the baked sheet (~1 ms).
- Visual fidelity is whatever we hand-author. The renderer is correct regardless of how Mario the placeholder tiles look.
- The bake step is *almost* a pure data-over-data transformation but operates on a `OffscreenCanvas`. Per `CONTEXT.md` § Pitfalls we do not test it; we eyeball the output instead.

## Update — 2026-05-07: ROM as one-shot transcription source

We collapsed options 1 and 2 of the original "Context" section. The `src/data/chr-tiles.ts` file is still the single source of truth for tile pixels, and the runtime is still pure string-grid → greyscale-canvas — no binary asset, no async loader, no ROM in the bundle. What changed: the 256 string-grid tiles are now **transcribed once from the original cartridge's CHR-ROM** by the dev-only script `scripts/extract-chr-from-rom.ts`, then committed verbatim. The ROM input is not committed.

The "single-file change" promise (Consequences, bullet 2) is now actually fulfilled: regenerating from a different CHR source is one script run, output redirected over `src/data/chr-tiles.ts`. The bake step, palette pipeline, demo, and `main.ts` are untouched by that regen.

For local development, an SMB1 iNES dump may live at `docs/data/smb.nes` (not shipped in the app bundle); `scripts/extract-chr-from-rom.ts` reads it only when you run the script. Named CHR indices for the throwaway scroll demo are **not** regenerated with the grids: they are curated in `src/data/demo-tile-slots.ts` and `src/demo/utils/build-demo-metatile-table.ts` so regen cannot reset them.

## Update — 2026-05-08: two pattern tables, one baked sheet per bank

The original "Context" section (and the 2026-05-07 update) framed CHR as "256 × 8×8 tiles". That was wrong. The cartridge ships **two** 256-tile pattern tables — the *sprite bank* at `$0000` and the *BG bank* at `$1000` — and SMB1 selects them independently for sprites and backgrounds via PPUCTRL. Together that is 8 KB / 512 tiles, exactly what `scripts/extract-chr-from-rom.ts` was already extracting; the runtime side just wasn't honouring the second half. The visible symptom: BG tile index `$24` (the SMB sky-blue blank) drew CHR slot `$24` from the sprite bank — a Mario-fragment tile — turning the sky into noise.

What changes:

- **Greyscale CHR sheet** widens to all 512 slots. Sprite bank in slots 0-255, BG bank in slots 256-511.
- **Bake step** produces **one baked canvas per pattern table**, paired with its bank's own sub-palette pool. Today only the BG bank is baked (with the four BG sub-palettes); the sprite bank is the slot the future sprite slice will rebake with the four sprite sub-palettes.
- **Render API** splits along bank lines: `drawBgTile(tileIndex0to255, ...)` ships now and reads from `bakedSheet.bgBank.canvas`; a future `drawSpriteTile` reads from `bakedSheet.spriteBank.canvas`. The bank offset never appears at call sites — metatile draws stay in BG-bank-relative `0..255` coordinates exactly like the disassembly's metatile dictionaries.

The "256 tile slots" wording in the original Decision and Consequences sections is superseded by this update.

## Update — 2026-05-08: universal backdrop split per area type

The original 2026-05-07 take treated each `AreaPalette` as fully self-describing, with slot 0 of every sub-palette holding the actual screen-clear colour (`$22` sky-blue for the placeholder ground palette). On real hardware the screen-clear colour lives in PPU `$3F00` — the *universal backdrop* — and is mirrored at slot 0 of every BG sub-palette; the asm sets it from a separate `BackgroundColors` table indexed by area type, not from the per-area `*PaletteData` blob.

Pretending the two were the same worked while we only had one area type wired. It falls apart the moment we want to ship the four area palettes (water, ground, underground, castle): the four area types share the same sub-palette layout convention but have different backdrops (sky-blue vs black), and a future `BackgroundColorCtrl` override (night levels in 3-1, etc.) needs to change the backdrop without touching sub-palette data.

What changes:

- **Raw `AreaPalette`s now hold `$0f` in slot 0 of every sub-palette**, exactly mirroring the asm's `*PaletteData` blobs. The values in `src/data/palettes.ts` are no longer "approximations"; they are verbatim `WaterPaletteData` / `GroundPaletteData` / `UndergroundPaletteData` / `CastlePaletteData` from `docs/data/SMBDIS.ASM`.
- **`areaBackdropColors`**, indexed by area type, carries the universal backdrop for each area type (`$22, $22, $0f, $0f`). It is a TS port of `BackgroundColors` at SMBDIS:1426; only the area-type row is ported today, the `BackgroundColorCtrl` row lands with the night-level slice.
- **`resolveAreaPalette(rawPalette, universalBackdrop)`** is a pure transform that returns a new `AreaPalette` with slot 0 of every sub-palette replaced by the supplied backdrop. The demo runs it before `bakePaletteVariants` so the bake step stays a pure renderer concern that knows nothing about area types.

The end-to-end pipeline is now:

```
ram.areaType ──┬─► areaPalettesByType[areaType]   ─►  resolveAreaPalette  ──► bakePaletteVariants
               └─► areaBackdropColors[areaType]   ─┘
```

`bakePaletteVariants`'s signature is unchanged.
