import type { GameRam } from './types.js';
import { readSignedByte } from './utils/signed-byte.js';

function storeHorizontalSpeedAbsolute(ram: GameRam): void {
  let spd = readSignedByte(ram.playerXSpeed);

  if (spd < 0) {
    spd = -spd & 0xff;
  }

  ram.playerXSpeedAbsolute = spd & 0xff;
}

function leftRightBits(ram: GameRam): number {
  return ram.savedJoypadBits & 0x03;
}

function applyLeftwardFrictionStep(ram: GameRam): void {
  let sum = ram.playerHorizontalMoveForce + ram.frictionAdderLow;

  const carry = sum > 0xff ? 1 : 0;

  ram.playerHorizontalMoveForce = sum & 0xff;

  sum = ram.playerXSpeed + ram.frictionAdderHigh + carry;
  ram.playerXSpeed = sum & 0xff;

  const cmp = ram.playerXSpeed - ram.maximumRightSpeed;

  if ((cmp & 0x80) === 0) {
    ram.playerXSpeed = ram.maximumRightSpeed;
  }
}

function applyRightwardFrictionStep(ram: GameRam): void {
  let sum = ram.playerHorizontalMoveForce - ram.frictionAdderLow;

  let borrow = 0;

  if (sum < 0) {
    sum += 256;
    borrow = 1;
  }

  ram.playerHorizontalMoveForce = sum & 0xff;

  sum = ram.playerXSpeed - ram.frictionAdderHigh - borrow;
  ram.playerXSpeed = sum & 0xff;

  const cmp = ram.playerXSpeed - ram.maximumLeftSpeed;

  if ((cmp & 0x80) !== 0) {
    ram.playerXSpeed = ram.maximumLeftSpeed;
  }
}

/**
 * Horizontal acceleration toward zero / caps (`ImposeFriction`).
 */
export function imposeFrictionOnPlayer(ram: GameRam): void {
  const lrIn = leftRightBits(ram);
  const masked = lrIn & ram.playerCollisionBits;

  if (masked === 0) {
    if (ram.playerXSpeed === 0) {
      storeHorizontalSpeedAbsolute(ram);

      return;
    }

    if ((ram.playerXSpeed & 0x80) === 0) {
      applyRightwardFrictionStep(ram);
    } else {
      applyLeftwardFrictionStep(ram);
    }

    storeHorizontalSpeedAbsolute(ram);

    return;
  }

  const rightPressed = (lrIn & 1) !== 0;

  if (!rightPressed) {
    applyRightwardFrictionStep(ram);
  } else {
    applyLeftwardFrictionStep(ram);
  }

  storeHorizontalSpeedAbsolute(ram);
}
