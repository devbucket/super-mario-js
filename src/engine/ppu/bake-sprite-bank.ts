import type { AreaPalette, BakedBank, MasterPalette } from './types.js';
import { SHEET_PX_W, TILE_PX, TILES_PER_BANK, TILES_PER_SHEET_ROW } from './types.js';
import { recolourSpriteTileRow } from './utils/recolour-sprite-tile-row.js';

const BANK_PX_H = (TILES_PER_BANK / TILES_PER_SHEET_ROW) * TILE_PX;

/** Bake sprite pattern table (CHR slots 0–255) × four sprite sub-palettes. */
export function bakeSpriteBank(chrSheet: OffscreenCanvas, masterPalette: MasterPalette, areaPalette: AreaPalette): BakedBank {
  const sourceCtx = chrSheet.getContext('2d');

  if (sourceCtx === null) {
    throw new Error('CHR sheet has no 2D context');
  }

  const sourceImage = sourceCtx.getImageData(0, 0, SHEET_PX_W, BANK_PX_H);
  const bakedW = SHEET_PX_W * 4;
  const spriteCanvas = new OffscreenCanvas(bakedW, BANK_PX_H);
  const spriteCtx = spriteCanvas.getContext('2d');

  if (spriteCtx === null) {
    throw new Error('Baked sprite bank has no 2D context');
  }

  const bakedImage = spriteCtx.createImageData(bakedW, BANK_PX_H);

  for (let y = 0; y < BANK_PX_H; y++) {
    recolourSpriteTileRow(sourceImage.data, bakedImage.data, y, y, areaPalette, masterPalette);
  }

  spriteCtx.putImageData(bakedImage, 0, 0);

  return { canvas: spriteCanvas };
}
