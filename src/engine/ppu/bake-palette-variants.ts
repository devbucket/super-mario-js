import type { AreaPalette, BakedChrSheet, MasterPalette } from './types.js';
import { SHEET_PX_H, SHEET_PX_W, SUB_PALETTE_COUNT, TILE_PX, TILES_PER_SHEET_ROW } from './types.js';
import { recolourTileRow } from './utils/recolour-tile-row.js';

/**
 * Pre-render every CHR slot × every sub-palette into a single offscreen
 * canvas. Per-frame tile draws are then pure `drawImage` blits from this
 * baked sheet (see `drawTile`).
 *
 * Layout: sub-palettes laid out horizontally, each occupying `SHEET_PX_W`
 * pixels of width, so the baked canvas is `SHEET_PX_W * SUB_PALETTE_COUNT`
 * wide by `SHEET_PX_H` tall.
 */
export function bakePaletteVariants(chrSheet: OffscreenCanvas, masterPalette: MasterPalette, areaPalette: AreaPalette): BakedChrSheet {
  const sourceCtx = chrSheet.getContext('2d');

  if (sourceCtx === null) {
    throw new Error('CHR sheet has no 2D context');
  }

  const sourceImage = sourceCtx.getImageData(0, 0, SHEET_PX_W, SHEET_PX_H);
  const bakedW = SHEET_PX_W * SUB_PALETTE_COUNT;
  const baked = new OffscreenCanvas(bakedW, SHEET_PX_H);
  const bakedCtx = baked.getContext('2d');

  if (bakedCtx === null) {
    throw new Error('Baked sheet has no 2D context');
  }

  const bakedImage = bakedCtx.createImageData(bakedW, SHEET_PX_H);

  for (let y = 0; y < SHEET_PX_H; y++) {
    recolourTileRow(sourceImage.data, bakedImage.data, y, areaPalette, masterPalette);
  }

  bakedCtx.putImageData(bakedImage, 0, 0);

  return {
    canvas: baked,
    subPaletteCount: SUB_PALETTE_COUNT,
    tilePx: TILE_PX,
    tilesPerRow: TILES_PER_SHEET_ROW,
  };
}
