import {
  frictionLowByteByVariant,
  maximumLeftSpeedByVariant,
  maximumRightSpeedByVariant,
  maximumRightSpeedPipeIntro,
  runningTimerReload,
} from '../data/player-physics-tables.js';
import type { GameRam } from './types.js';

const maskLeftRightJoypadBits = 0x03;
const maskRunButton = 0x40;

function leftRightFiltered(ram: GameRam): number {
  return ram.savedJoypadBits & maskLeftRightJoypadBits & ram.playerCollisionBits;
}

function runButtonHeld(ram: GameRam): boolean {
  return (ram.savedJoypadBits & maskRunButton) !== 0;
}

function commitFrictionAndCaps(ram: GameRam, variantY: number, frictionSlot: number): void {
  ram.maximumLeftSpeed = maximumLeftSpeedByVariant[variantY]!;

  let rightIndex = variantY;

  if (ram.gameEngineSubroutine === 7) {
    rightIndex = 3;
  }

  ram.maximumRightSpeed = rightIndex === 3 ? maximumRightSpeedPipeIntro : maximumRightSpeedByVariant[rightIndex];

  ram.frictionAdderLow = frictionLowByteByVariant[frictionSlot]!;
  ram.frictionAdderHigh = 0;

  if (ram.playerFacingDir !== ram.playerMovingDir) {
    const carry = ram.frictionAdderLow & 0x80 ? 1 : 0;

    ram.frictionAdderLow = (ram.frictionAdderLow << 1) & 0xff;
    ram.frictionAdderHigh = ((ram.frictionAdderHigh << 1) | carry) & 0xff;
  }
}

/**
 * Tail of `PlayerPhysicsSub` that fills caps/friction (`X_Physics` → `GetXPhy`).
 */
export function configurePlayerHorizontalPhysics(ram: GameRam): void {
  let variantY = 0;
  let frictionSlot = 0;

  if (ram.playerState === 0) {
    variantY += 1;

    if (ram.areaType !== 0) {
      variantY -= 1;

      const lr = leftRightFiltered(ram);

      if (lr !== 0 && lr === ram.playerMovingDir) {
        if (runButtonHeld(ram)) {
          ram.runningTimer = runningTimerReload;
        }

        if (ram.runningTimer !== 0) {
          commitFrictionAndCaps(ram, variantY, frictionSlot);

          return;
        }
      }
    }
  } else if (ram.playerXSpeedAbsolute >= 0x19) {
    commitFrictionAndCaps(ram, variantY, frictionSlot);

    return;
  }

  variantY += 1;
  frictionSlot += 1;

  if (ram.runningSpeed !== 0) {
    frictionSlot += 1;
  } else if (ram.playerXSpeedAbsolute >= 0x21) {
    frictionSlot += 1;
  }

  commitFrictionAndCaps(ram, variantY, frictionSlot);
}
