/**
 * Renderer types shared across the PPU module.
 *
 * Vocabulary follows CONTEXT.md § Rendering pipeline:
 * - master palette = 64-entry RGB table.
 * - sub-palette    = four indices into the master palette.
 * - area palette   = the four background sub-palettes used while an area is active.
 * - CHR sheet      = greyscale offscreen canvas of all 256 tile slots.
 * - baked CHR sheet = every CHR slot recoloured with every sub-palette,
 *                     ready for per-frame `drawImage` blits.
 */

export const TILE_PX = 8;
export const TILES_PER_SHEET_ROW = 16;
export const TILE_SLOTS = 256;
export const SHEET_PX_W = TILES_PER_SHEET_ROW * TILE_PX;
export const SHEET_PX_H = (TILE_SLOTS / TILES_PER_SHEET_ROW) * TILE_PX;

export const SUB_PALETTE_COUNT = 4;
export const PALETTE_INDICES_PER_SUB = 4;

export const METATILE_PX = 16;

export type RgbTriple = readonly [number, number, number];
export type MasterPalette = readonly RgbTriple[];
export type SubPalette = readonly [number, number, number, number];

export interface AreaPalette {
  readonly background: readonly [SubPalette, SubPalette, SubPalette, SubPalette];
}

export interface BakedChrSheet {
  readonly canvas: OffscreenCanvas;
  readonly subPaletteCount: number;
  readonly tilePx: number;
  readonly tilesPerRow: number;
}

export interface MetatileEntry {
  readonly tileIndices: readonly [number, number, number, number];
  readonly subPaletteIndex: number;
}

export type MetatileTable = readonly MetatileEntry[];
