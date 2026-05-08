import type { GameRam } from './types.js';

const maskDownButton = 0x04;

/** Ground + big Mario only (`PlayerMovementSubs` crouch preamble). */
export function applyPlayerCrouchFlag(ram: GameRam): void {
  if (ram.marioSizeCode === 1) {
    ram.crouchingFlag = 0;

    return;
  }

  if (ram.playerState !== 0) {
    ram.crouchingFlag = 0;

    return;
  }

  ram.crouchingFlag = (ram.savedJoypadBits & maskDownButton) !== 0 ? 1 : 0;
}
