import { drawMetatile } from '../../engine/ppu/draw-metatile.js';
import type { BakedChrSheet, MetatileTable } from '../../engine/ppu/types.js';
import { METATILE_PX } from '../../engine/ppu/types.js';

/**
 * Render the visible columns of the demo level for the current camera.
 *
 * No offscreen-canvas optimisation here: we redraw every visible metatile
 * each frame. The smarter "pre-rendered nametable + only update the
 * incoming column" path lands later, when we know the real level width.
 */
export function drawDemoWorld(
  ctx: CanvasRenderingContext2D,
  baked: BakedChrSheet,
  table: MetatileTable,
  metatiles: Uint8Array,
  widthMt: number,
  heightMt: number,
  scrollXPx: number,
  viewportWidthPx: number,
): void {
  const firstColMt = Math.max(0, Math.floor(scrollXPx / METATILE_PX));
  const lastColMt = Math.min(widthMt - 1, Math.floor((scrollXPx + viewportWidthPx - 1) / METATILE_PX));

  for (let row = 0; row < heightMt; row++) {
    const rowOffset = row * widthMt;

    for (let col = firstColMt; col <= lastColMt; col++) {
      const mtIndex = metatiles[rowOffset + col];
      const screenX = col * METATILE_PX - scrollXPx;
      const screenY = row * METATILE_PX;

      drawMetatile(ctx, baked, table, mtIndex, screenX, screenY);
    }
  }
}
