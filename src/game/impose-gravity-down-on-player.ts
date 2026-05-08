import type { GameRam } from './types.js';

/**
 * Vertical integration shared by the player (`ImposeGravity` with downward stack flag).
 */
export function imposeGravityDownOnPlayer(ram: GameRam, downwardMovementAmount: number, maximumVerticalSpeed: number): void {
  let wideSum = ram.playerYMoveForceDummy + ram.playerYMoveForce;

  ram.playerYMoveForceDummy = wideSum & 0xff;
  let carry = wideSum > 0xff ? 1 : 0;

  const speedSignExtension = (ram.playerYSpeed & 0x80) !== 0 ? 0xff : 0;

  wideSum = ram.playerYPx + ram.playerYSpeed + carry;
  ram.playerYPx = wideSum & 0xff;
  carry = wideSum > 0xff ? 1 : 0;

  wideSum = ram.playerYHighPos + speedSignExtension + carry;
  ram.playerYHighPos = wideSum & 0xff;

  wideSum = ram.playerYMoveForce + downwardMovementAmount;
  carry = wideSum > 0xff ? 1 : 0;
  ram.playerYMoveForce = wideSum & 0xff;

  wideSum = ram.playerYSpeed + carry;
  ram.playerYSpeed = wideSum & 0xff;

  if ((ram.playerYSpeed & 0xff) < (maximumVerticalSpeed & 0xff)) {
    return;
  }

  if (ram.playerYMoveForce < 0x80) {
    return;
  }

  ram.playerYSpeed = maximumVerticalSpeed & 0xff;
  ram.playerYMoveForce = 0;
}
