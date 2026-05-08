import type { GameRam } from './types.js';

const facingRight = 1;
const facingLeft = 2;

/** Derive movement dir from horizontal speed (`PlayerCtrlRoutine` `PlayerSubs`). */
export function updatePlayerMovingDirectionFromSpeed(ram: GameRam): void {
  const spd = ram.playerXSpeed & 0xff;

  if (spd === 0) {
    ram.playerMovingDir = ram.playerFacingDir;

    return;
  }

  if ((spd & 0x80) === 0) {
    ram.playerMovingDir = facingRight;

    return;
  }

  ram.playerMovingDir = facingLeft;
}
