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
