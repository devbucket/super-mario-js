import { drawBgTile } from './draw-bg-tile.js';
import type { BakedChrSheet, MetatileTable } from './types.js';
import { TILE_PX } from './types.js';

/**
 * Draw a 16×16 metatile (2×2 CHR tiles) at the given screen position.
 *
 * Tile-index order in `MetatileEntry.tileIndices` is top-left, top-right,
 * bottom-left, bottom-right.
 */
export function drawMetatile(
  ctx: CanvasRenderingContext2D,
  baked: BakedChrSheet,
  metatileTable: MetatileTable,
  metatileIndex: number,
  xPx: number,
  yPx: number,
): void {
  const entry = metatileTable[metatileIndex];

  if (entry === undefined) {
    return;
  }

  const [tl, tr, bl, br] = entry.tileIndices;
  const sub = entry.subPaletteIndex;

  drawBgTile(ctx, baked, tl, sub, xPx, yPx);
  drawBgTile(ctx, baked, tr, sub, xPx + TILE_PX, yPx);
  drawBgTile(ctx, baked, bl, sub, xPx, yPx + TILE_PX);
  drawBgTile(ctx, baked, br, sub, xPx + TILE_PX, yPx + TILE_PX);
}
