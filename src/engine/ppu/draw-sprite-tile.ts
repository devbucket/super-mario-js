import type { BakedChrSheet } from './types.js';
import { SHEET_PX_W } from './types.js';

/** Draw one 8×8 sprite-bank CHR tile (`tileIndex` 0–255), sprite sub-palette slot 0–3. */
export function drawSpriteTile(
  ctx: CanvasRenderingContext2D,
  baked: BakedChrSheet,
  tileIndex: number,
  subPaletteIndex: number,
  xPx: number,
  yPx: number,
  flipX = false,
): void {
  const sourceX = (tileIndex % baked.tilesPerRow) * baked.tilePx + subPaletteIndex * SHEET_PX_W;
  const sourceY = Math.floor(tileIndex / baked.tilesPerRow) * baked.tilePx;
  const w = baked.tilePx;

  if (!flipX) {
    ctx.drawImage(baked.spriteBank.canvas, sourceX, sourceY, w, w, xPx, yPx, w, w);

    return;
  }

  ctx.save();
  ctx.translate(xPx + w, yPx);
  ctx.scale(-1, 1);
  ctx.drawImage(baked.spriteBank.canvas, sourceX, sourceY, w, w, 0, 0, w, w);
  ctx.restore();
}
