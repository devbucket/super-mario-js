import { imposeFrictionOnPlayer } from './impose-friction-on-player.js';
import { movePlayerObjectHorizontally } from './move-player-object-horizontally.js';
import type { GameRam } from './types.js';
import { updatePlayerAnimSpeed } from './update-player-anim-speed.js';

/** Ground movement dispatch (`OnGroundStateSub`). */
export function tickPlayerOnGroundSub(ram: GameRam): void {
  updatePlayerAnimSpeed(ram);

  const lr = ram.savedJoypadBits & 0x03;

  if (lr !== 0) {
    ram.playerFacingDir = lr;
  }

  imposeFrictionOnPlayer(ram);
  movePlayerObjectHorizontally(ram);
}
