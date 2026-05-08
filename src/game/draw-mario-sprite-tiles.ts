import { drawSpriteTile } from '../engine/ppu/draw-sprite-tile.js';
import type { BakedChrSheet } from '../engine/ppu/types.js';
import { isMarioBigStandTiles } from './is-mario-big-stand-tiles.js';
import { shouldSkipMarioChrTile } from './resolve-mario-chr-tiles.js';

const marioSpritePaletteIndex = 0;

/** Composite four 8×8 tiles at `originXPx`/`originYPx` (local space when the caller applies a horizontal mirror). */
export function drawMarioSpriteTiles(
  ctx: CanvasRenderingContext2D,
  baked: BakedChrSheet,
  tiles: readonly number[],
  originXPx: number,
  originYPx: number,
  wholeSpriteMirroredHorizontally: boolean,
): void {
  const tl = tiles[0];
  const tr = tiles[1];
  const bl = tiles[2];
  const br = tiles[3];

  const duplicateBottomRow = bl === br && !shouldSkipMarioChrTile(bl) && !shouldSkipMarioChrTile(br);
  const bigStand = isMarioBigStandTiles(tiles);

  const flipBottomLeft = duplicateBottomRow && wholeSpriteMirroredHorizontally;
  const flipBottomRight = duplicateBottomRow && (!wholeSpriteMirroredHorizontally || bigStand);

  if (!shouldSkipMarioChrTile(tl)) {
    drawSpriteTile(ctx, baked, tl, marioSpritePaletteIndex, originXPx, originYPx);
  }

  if (!shouldSkipMarioChrTile(tr)) {
    drawSpriteTile(ctx, baked, tr, marioSpritePaletteIndex, originXPx + 8, originYPx);
  }

  if (!shouldSkipMarioChrTile(bl)) {
    drawSpriteTile(ctx, baked, bl, marioSpritePaletteIndex, originXPx, originYPx + 8, flipBottomLeft);
  }

  if (!shouldSkipMarioChrTile(br)) {
    drawSpriteTile(ctx, baked, br, marioSpritePaletteIndex, originXPx + 8, originYPx + 8, flipBottomRight);
  }
}
