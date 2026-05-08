/**
 * Renderer types shared across the PPU module.
 *
 * Vocabulary follows CONTEXT.md § Rendering pipeline:
 * - master palette  = 64-entry RGB table.
 * - sub-palette     = four indices into the master palette.
 * - area palette    = the four background sub-palettes used while an area is active.
 * - pattern table   = one of the two 256-tile halves of CHR (sprite bank / BG bank).
 * - CHR sheet       = greyscale offscreen canvas of all 512 tile slots
 *                     (sprite bank in slots 0-255, BG bank in slots 256-511).
 * - baked CHR sheet = per-pattern-table canvas with every CHR slot recoloured
 *                     with every sub-palette of that bank's pool, ready for
 *                     per-frame `drawImage` blits.
 */

export const TILE_PX = 8;
export const TILES_PER_SHEET_ROW = 16;

export const TILES_PER_BANK = 256;
export const BANK_COUNT = 2;
export const TILE_SLOTS = TILES_PER_BANK * BANK_COUNT;

export const SHEET_PX_W = TILES_PER_SHEET_ROW * TILE_PX;
export const SHEET_PX_H = (TILE_SLOTS / TILES_PER_SHEET_ROW) * TILE_PX;

/** Source-row offset of the BG pattern table inside the greyscale CHR sheet, in tile slots. */
export const BG_BANK_SOURCE_OFFSET = TILES_PER_BANK;

export const SUB_PALETTE_COUNT = 4;
export const PALETTE_INDICES_PER_SUB = 4;

export const METATILE_PX = 16;

/**
 * Visible gameplay layer starts immediately below fixed nametable HUD rows 0–3
 * (`$2043–$207a`): last status tile row ends at pixel 31, next row begins at 32.
 * Rendering must offset BG and sprites by this amount so skies/clouds align with SMB.
 */
export const NES_PLAYFIELD_ORIGIN_Y_PX = 32;

export type RgbTriple = readonly [number, number, number];
export type MasterPalette = readonly RgbTriple[];
export type SubPalette = readonly [number, number, number, number];

export interface AreaPalette {
  readonly background: readonly [SubPalette, SubPalette, SubPalette, SubPalette];
  readonly sprite: readonly [SubPalette, SubPalette, SubPalette, SubPalette];
}

export interface BakedBank {
  readonly canvas: OffscreenCanvas;
}

export interface BakedChrSheet {
  readonly bgBank: BakedBank;
  readonly spriteBank: BakedBank;
  readonly tilePx: number;
  readonly tilesPerRow: number;
  readonly subPaletteCount: number;
}

export interface MetatileEntry {
  readonly tileIndices: readonly [number, number, number, number];
  readonly subPaletteIndex: number;
}

export type MetatileTable = readonly MetatileEntry[];
