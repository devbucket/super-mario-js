import { jumpSwimTimerInitial } from '../data/player-physics-constants.js';
import {
  fallVerticalForceByVariant,
  jumpInitialVerticalMoveForceByVariant,
  jumpVerticalForceByVariant,
  playerVerticalSpeedByVariant,
} from '../data/player-physics-tables.js';
import type { GameRam } from './types.js';

const maskJumpButton = 0x80;

function jumpVariantFromHorizontalSpeed(ram: GameRam): number {
  let variant = 0;

  if (ram.playerXSpeedAbsolute >= 0x09) {
    variant += 1;
  }

  if (ram.playerXSpeedAbsolute >= 0x10) {
    variant += 1;
  }

  if (ram.playerXSpeedAbsolute >= 0x19) {
    variant += 1;
  }

  if (ram.playerXSpeedAbsolute >= 0x1c) {
    variant += 1;
  }

  return variant;
}

function applyJumpImpulseForVariant(ram: GameRam, variant: number): void {
  ram.verticalForce = jumpVerticalForceByVariant[variant]!;
  ram.verticalForceDown = fallVerticalForceByVariant[variant]!;
  ram.playerYMoveForce = jumpInitialVerticalMoveForceByVariant[variant]!;
  ram.playerYSpeed = playerVerticalSpeedByVariant[variant]!;
}

/** Beginning of air impulse when A is pressed (`ProcJumping` / `InitJS`, dry land only). */
export function tryInitPlayerJump(ram: GameRam): void {
  if (ram.jumpspringAnimCtrl !== 0) {
    return;
  }

  const jumpHeld = (ram.savedJoypadBits & maskJumpButton) !== 0;
  const jumpHeldPrev = (ram.previousAbJoypadBits & maskJumpButton) !== 0;

  if (!jumpHeld || jumpHeldPrev) {
    return;
  }

  if (ram.playerState !== 0) {
    return;
  }

  ram.jumpSwimTimer = jumpSwimTimerInitial;
  ram.playerYMoveForceDummy = 0;
  ram.playerYMoveForce = 0;
  ram.jumpOriginYHighPos = ram.playerYHighPos;
  ram.jumpOriginYPosition = ram.playerYPx;
  ram.playerState = 1;
  ram.diffToHaltJump = 1;

  const variant = jumpVariantFromHorizontalSpeed(ram);

  applyJumpImpulseForVariant(ram, variant);
}
