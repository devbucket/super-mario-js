import type { AreaPalette, BakedChrSheet, MasterPalette } from './types.js';
import { BG_BANK_SOURCE_OFFSET, SHEET_PX_H, SHEET_PX_W, SUB_PALETTE_COUNT, TILE_PX, TILES_PER_BANK, TILES_PER_SHEET_ROW } from './types.js';
import { recolourTileRow } from './utils/recolour-tile-row.js';

const BG_BANK_SOURCE_OFFSET_PX = (BG_BANK_SOURCE_OFFSET / TILES_PER_SHEET_ROW) * TILE_PX;
const BANK_PX_H = (TILES_PER_BANK / TILES_PER_SHEET_ROW) * TILE_PX;

/**
 * Pre-render the BG pattern table × every BG sub-palette into a single
 * offscreen canvas. Per-frame BG tile draws are then pure `drawImage` blits
 * from this baked sheet (see `drawBgTile`).
 *
 * Layout: BG sub-palettes laid out horizontally, each occupying `SHEET_PX_W`
 * pixels of width, so the baked canvas is `SHEET_PX_W * SUB_PALETTE_COUNT`
 * wide by `BANK_PX_H` (= 128 px) tall.
 *
 * The sprite pattern table stays unbaked here. The sprite slice will rebake
 * it with sprite sub-palettes and populate `spriteBank`.
 */
export function bakePaletteVariants(chrSheet: OffscreenCanvas, masterPalette: MasterPalette, areaPalette: AreaPalette): BakedChrSheet {
  const sourceCtx = chrSheet.getContext('2d');

  if (sourceCtx === null) {
    throw new Error('CHR sheet has no 2D context');
  }

  const sourceImage = sourceCtx.getImageData(0, 0, SHEET_PX_W, SHEET_PX_H);
  const bakedW = SHEET_PX_W * SUB_PALETTE_COUNT;
  const bgCanvas = new OffscreenCanvas(bakedW, BANK_PX_H);
  const bgCtx = bgCanvas.getContext('2d');

  if (bgCtx === null) {
    throw new Error('Baked BG-bank sheet has no 2D context');
  }

  const bakedImage = bgCtx.createImageData(bakedW, BANK_PX_H);

  for (let y = 0; y < BANK_PX_H; y++) {
    recolourTileRow(sourceImage.data, bakedImage.data, BG_BANK_SOURCE_OFFSET_PX + y, y, areaPalette, masterPalette);
  }

  bgCtx.putImageData(bakedImage, 0, 0);

  return {
    bgBank: { canvas: bgCanvas },
    spriteBank: null,
    tilePx: TILE_PX,
    tilesPerRow: TILES_PER_SHEET_ROW,
    subPaletteCount: SUB_PALETTE_COUNT,
  };
}
