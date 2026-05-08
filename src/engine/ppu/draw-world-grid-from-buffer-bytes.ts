import { Palette0_MTiles, Palette1_MTiles, Palette2_MTiles, Palette3_MTiles } from '../../data/extracted/palette-mtiles.js';
import { drawBgTile } from './draw-bg-tile.js';
import type { BakedChrSheet } from './types.js';
import { METATILE_PX, NES_PLAYFIELD_ORIGIN_Y_PX, TILE_PX } from './types.js';

const paletteMetatileQuads: readonly Uint8Array[] = [Palette0_MTiles, Palette1_MTiles, Palette2_MTiles, Palette3_MTiles];

export function drawMetatileBufferByte(ctx: CanvasRenderingContext2D, baked: BakedChrSheet, combinedByte: number, xPx: number, yPx: number): void {
  const paletteIndex = (combinedByte >> 6) & 3;
  const metatileSlot = combinedByte & 0x3f;
  const base = metatileSlot << 2;
  const table = paletteMetatileQuads[paletteIndex];

  const topLeft = table[base];
  const bottomLeft = table[base + 1];
  const topRight = table[base + 2];
  const bottomRight = table[base + 3];

  drawBgTile(ctx, baked, topLeft, paletteIndex, xPx, yPx);
  drawBgTile(ctx, baked, topRight, paletteIndex, xPx + TILE_PX, yPx);
  drawBgTile(ctx, baked, bottomLeft, paletteIndex, xPx, yPx + TILE_PX);
  drawBgTile(ctx, baked, bottomRight, paletteIndex, xPx + TILE_PX, yPx + TILE_PX);
}

export function drawWorldGridFromBufferBytes(
  ctx: CanvasRenderingContext2D,
  baked: BakedChrSheet,
  grid: Uint8Array,
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
      const combined = grid[rowOffset + col];
      const screenX = col * METATILE_PX - scrollXPx;
      const screenY = NES_PLAYFIELD_ORIGIN_Y_PX + row * METATILE_PX;

      drawMetatileBufferByte(ctx, baked, combined, screenX, screenY);
    }
  }
}
