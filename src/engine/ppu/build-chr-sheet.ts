import type { TilePixels } from '../../data/chr-tiles.js';
import { SHEET_PX_H, SHEET_PX_W, TILE_PX, TILES_PER_SHEET_ROW } from './types.js';
import { decodeTileStrings } from './utils/decode-tile-strings.js';
import { writeTileIntoSheet } from './utils/write-tile-into-sheet.js';

/**
 * Compose the in-source CHR tiles into a 128×128 greyscale offscreen canvas
 * (16 tiles wide × 16 rows = 256 slots). Slots beyond `tiles.length` are
 * left as the backdrop grey so the sheet always has 256 slots.
 */
export function buildChrSheet(tiles: readonly TilePixels[]): OffscreenCanvas {
  const canvas = new OffscreenCanvas(SHEET_PX_W, SHEET_PX_H);
  const ctx = canvas.getContext('2d');

  if (ctx === null) {
    throw new Error('Failed to acquire 2D context for CHR sheet');
  }

  const image = ctx.createImageData(SHEET_PX_W, SHEET_PX_H);

  for (let slot = 0; slot < tiles.length; slot++) {
    const pixels = decodeTileStrings(tiles[slot]);
    const slotXPx = (slot % TILES_PER_SHEET_ROW) * TILE_PX;
    const slotYPx = Math.floor(slot / TILES_PER_SHEET_ROW) * TILE_PX;

    writeTileIntoSheet(image, pixels, slotXPx, slotYPx);
  }

  ctx.putImageData(image, 0, 0);

  return canvas;
}
