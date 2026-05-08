import type { GameRam } from './types.js';

const maskDown = 0x04;
const maskLeftRight = 0x03;

/** Down + ground clears simulated left/right (`PlayerCtrlRoutine` `SizeChk`). */
export function nullifyHorizontalWhenHoldingDownOnGround(ram: GameRam): void {
  if ((ram.savedJoypadBits & maskDown) === 0) {
    return;
  }

  if (ram.playerState !== 0) {
    return;
  }

  if ((ram.savedJoypadBits & maskLeftRight) === 0) {
    return;
  }

  ram.savedJoypadBits &= ~(maskLeftRight | maskDown);
}
