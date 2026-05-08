import type { GameRam } from './types.js';

/** Provisional floor until block-buffer collision exists. */
export function stubClampPlayerToFlatFloor(ram: GameRam, floorYPx: number): void {
  if (ram.playerYPx >= floorYPx && (ram.playerYSpeed & 0x80) === 0) {
    ram.playerYPx = floorYPx;
    ram.playerYSpeed = 0;
    ram.playerYMoveForce = 0;
    ram.playerYMoveForceDummy = 0;

    if (ram.playerState === 2) {
      ram.playerState = 0;
    }

    return;
  }

  if (ram.playerState === 0 && ram.playerYPx < floorYPx) {
    ram.playerState = 2;
  }
}
