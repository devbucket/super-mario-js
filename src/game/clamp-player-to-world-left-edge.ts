import { getPlayerWorldXPx } from './get-player-world-x-px.js';
import type { GameRam } from './types.js';

export interface ClampPlayerToWorldLeftEdgeContext {
  readonly worldWidthPx: number;
  readonly viewportWidthPx: number;
}

/**
 * Stub wall at world X=0: recover from left-scroll underflow (unsigned world X past level extent).
 */
export function clampPlayerToWorldLeftEdge(ram: GameRam, ctx: ClampPlayerToWorldLeftEdgeContext): void {
  const wx = getPlayerWorldXPx(ram);
  const maxValidWx = ctx.worldWidthPx + ctx.viewportWidthPx;

  if (wx <= maxValidWx) {
    return;
  }

  ram.playerPageLoc = 0;
  ram.playerXPx = 0;
  ram.playerXSpeed = 0;
  ram.playerHorizontalMoveForce = 0;
  ram.playerXSpeedAbsolute = 0;
}
