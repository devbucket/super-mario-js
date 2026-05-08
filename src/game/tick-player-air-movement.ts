import { imposeFrictionOnPlayer } from './impose-friction-on-player.js';
import { movePlayerObjectHorizontally } from './move-player-object-horizontally.js';
import { movePlayerVertically } from './move-player-vertically.js';
import type { GameRam } from './types.js';

/** Shared air horizontal + vertical step (`LRAir` / `JSMove` paths). */
export function tickPlayerAirMovement(ram: GameRam): void {
  const lr = ram.savedJoypadBits & 0x03;

  if (lr !== 0) {
    ram.playerFacingDir = lr;
    imposeFrictionOnPlayer(ram);
  }

  movePlayerObjectHorizontally(ram);
  movePlayerVertically(ram);
}
