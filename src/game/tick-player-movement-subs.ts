import { applyPlayerCrouchFlag } from './apply-player-crouch-flag.js';
import { playerPhysicsSub } from './player-physics-sub.js';
import { runPlayerMovementJumpEngine } from './run-player-movement-jump-engine.js';
import type { GameRam } from './types.js';

/** Full movement chain (`PlayerMovementSubs`). */
export function tickPlayerMovementSubs(ram: GameRam): void {
  ram.runningSpeed = (ram.savedJoypadBits & 0x40) !== 0 ? 1 : 0;

  applyPlayerCrouchFlag(ram);

  if (ram.playerChangeSizeFlag !== 0) {
    return;
  }

  playerPhysicsSub(ram);

  if (ram.playerChangeSizeFlag !== 0) {
    return;
  }

  runPlayerMovementJumpEngine(ram);
}
