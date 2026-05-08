import type { BakedChrSheet } from '../engine/ppu/types.js';
import { drawMarioSpriteTiles } from './draw-mario-sprite-tiles.js';
import { resolveMarioChrTiles } from './resolve-mario-chr-tiles.js';
import type { GameRam } from './types.js';

const facingLeft = 2;
const marioSpriteWidthPx = 16;
/** Small Mario is drawn 16 px above `playerYPx` so the 16×16 sprite sits in the row above the foot-collision band. */
const smallMarioSpriteYOffsetPx = -16;

/** Composite Mario as four 8×8 tiles (screen coordinates after camera scroll). */
export function drawMarioSprite(ctx: CanvasRenderingContext2D, baked: BakedChrSheet, ram: GameRam, screenXPx: number, screenYPx: number): void {
  const tiles = resolveMarioChrTiles(ram);
  const yOffset = ram.marioSizeCode === 1 ? smallMarioSpriteYOffsetPx : 0;
  const drawY = screenYPx + yOffset;

  ctx.save();

  if (ram.playerFacingDir === facingLeft) {
    ctx.translate(screenXPx + marioSpriteWidthPx, drawY);
    ctx.scale(-1, 1);
    drawMarioSpriteTiles(ctx, baked, tiles, 0, 0, true);
  } else {
    drawMarioSpriteTiles(ctx, baked, tiles, screenXPx, drawY, false);
  }

  ctx.restore();
}
