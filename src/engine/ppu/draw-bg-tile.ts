import type { BakedChrSheet } from './types.js';
import { SHEET_PX_W } from './types.js';

/**
 * Blit one 8×8 BG-bank CHR slot from the baked sheet to the target canvas,
 * using the requested BG sub-palette. `tileIndex` is a BG-bank-relative slot
 * number in `0..255`; the BG bank's own baked canvas is selected via
 * `baked.bgBank.canvas`. Sub-palette variants live side-by-side, so the
 * `subPaletteIndex * SHEET_PX_W` offset selects the right one.
 */
export function drawBgTile(ctx: CanvasRenderingContext2D, baked: BakedChrSheet, tileIndex: number, subPaletteIndex: number, xPx: number, yPx: number): void {
  const sourceX = (tileIndex % baked.tilesPerRow) * baked.tilePx + subPaletteIndex * SHEET_PX_W;
  const sourceY = Math.floor(tileIndex / baked.tilesPerRow) * baked.tilePx;

  ctx.drawImage(baked.bgBank.canvas, sourceX, sourceY, baked.tilePx, baked.tilePx, xPx, yPx, baked.tilePx, baked.tilePx);
}
