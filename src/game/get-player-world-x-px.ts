import type { GameRam } from './types.js';

export function getPlayerWorldXPx(ram: GameRam): number {
  return ((ram.playerPageLoc & 0xff) << 8) | (ram.playerXPx & 0xff);
}
