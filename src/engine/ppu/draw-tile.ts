import type { BakedChrSheet } from './types.js';
import { SHEET_PX_W } from './types.js';

/**
 * Blit one 8×8 CHR slot from the baked sheet to the target canvas, using
 * the requested sub-palette. The baked sheet stores all four sub-palette
 * variants side-by-side; offsetting by `subPaletteIndex * SHEET_PX_W`
 * selects the right one.
 */
export function drawTile(ctx: CanvasRenderingContext2D, baked: BakedChrSheet, tileIndex: number, subPaletteIndex: number, xPx: number, yPx: number): void {
  const sourceX = (tileIndex % baked.tilesPerRow) * baked.tilePx + subPaletteIndex * SHEET_PX_W;
  const sourceY = Math.floor(tileIndex / baked.tilesPerRow) * baked.tilePx;

  ctx.drawImage(baked.canvas, sourceX, sourceY, baked.tilePx, baked.tilePx, xPx, yPx, baked.tilePx, baked.tilePx);
}
