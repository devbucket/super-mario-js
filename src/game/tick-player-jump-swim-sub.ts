import { tickPlayerAirMovement } from './tick-player-air-movement.js';
import type { GameRam } from './types.js';

/** Rising jump arc vs transition to falling (`JumpSwimSub`, dry land only). */
export function tickPlayerJumpSwimSub(ram: GameRam): void {
  const rising = (ram.playerYSpeed & 0x80) !== 0;

  if (!rising) {
    ram.verticalForce = ram.verticalForceDown;
    ram.playerState = 2;
  } else {
    const holdingJumpContinuous = (ram.savedJoypadBits & 0x80) !== 0 && (ram.previousAbJoypadBits & 0x80) !== 0;

    if (!holdingJumpContinuous) {
      const delta = (ram.jumpOriginYPosition - ram.playerYPx) & 0xff;

      if (delta >= ram.diffToHaltJump) {
        ram.verticalForce = ram.verticalForceDown;
      }
    }
  }

  tickPlayerAirMovement(ram);
}
