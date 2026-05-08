import type { GameRam } from './types.js';
import { readSignedByte } from './utils/signed-byte.js';

/**
 * Integrate horizontal speed into pixel/page (`MoveObjectHorizontally`, player slot).
 * Returns a scroll-assist byte consumed by the camera (`playerHorizontalScrollAssist`).
 */
export function movePlayerObjectHorizontally(ram: GameRam): number {
  if (ram.jumpspringAnimCtrl !== 0) {
    return 0;
  }

  const spd = ram.playerXSpeed & 0xff;
  const fractionalBoost = (spd & 0x0f) << 4;
  let highNybble = (spd >> 4) & 0x0f;

  if ((highNybble & 0x08) !== 0) {
    highNybble |= 0xf0;
  }

  const signedHigh = readSignedByte(highNybble);
  const pageExtension = signedHigh < 0 ? 0xff : 0;

  let wideSum = ram.playerHorizontalMoveForce + fractionalBoost;
  const fractionCarry = wideSum >> 8;

  ram.playerHorizontalMoveForce = wideSum & 0xff;

  const movementByte = signedHigh & 0xff;
  const positionSum = (ram.playerXPx & 0xff) + movementByte + fractionCarry;

  ram.playerXPx = positionSum & 0xff;
  const positionCarry = positionSum >>> 8;

  wideSum = ram.playerPageLoc + pageExtension + positionCarry;
  ram.playerPageLoc = wideSum & 0xff;

  return (signedHigh + fractionCarry) & 0xff;
}
