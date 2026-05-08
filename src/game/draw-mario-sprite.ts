import type { BakedChrSheet } from '../engine/ppu/types.js';
import { drawMarioSpriteTiles } from './draw-mario-sprite-tiles.js';
import { resolveMarioChrTiles } from './resolve-mario-chr-tiles.js';
import type { GameRam } from './types.js';

const facingLeft = 2;
const marioSpriteWidthPx = 16;

/** Composite Mario as four 8×8 tiles (screen coordinates after camera scroll). */
export function drawMarioSprite(ctx: CanvasRenderingContext2D, baked: BakedChrSheet, ram: GameRam, screenXPx: number, screenYPx: number): void {
  const tiles = resolveMarioChrTiles(ram);

  ctx.save();

  if (ram.playerFacingDir === facingLeft) {
    ctx.translate(screenXPx + marioSpriteWidthPx, screenYPx);
    ctx.scale(-1, 1);
    drawMarioSpriteTiles(ctx, baked, tiles, 0, 0, true);
  } else {
    drawMarioSpriteTiles(ctx, baked, tiles, screenXPx, screenYPx, false);
  }

  ctx.restore();
}
