import { playerAnimTimerByVariant } from '../data/player-physics-tables.js';
import type { GameRam } from './types.js';

/**
 * Animation cadence + low-speed skid (`GetPlayerAnimSpeed` without fireflower/star branches).
 */
export function updatePlayerAnimSpeed(ram: GameRam): void {
  let tableOffset = 0;

  if (ram.playerXSpeedAbsolute < 0x1c) {
    tableOffset += 1;
  }

  if (ram.playerXSpeedAbsolute < 0x0e) {
    tableOffset += 1;
  }

  const nonJumpBits = ram.savedJoypadBits & 0x7f;

  if (nonJumpBits !== 0) {
    const lrOnly = ram.savedJoypadBits & 0x03;

    if (lrOnly !== 0 && lrOnly !== ram.playerMovingDir) {
      if (ram.playerXSpeedAbsolute < 0x0b) {
        ram.playerMovingDir = ram.playerFacingDir;
        ram.playerXSpeed = 0;
        ram.playerHorizontalMoveForce = 0;
      }
    }
  }

  ram.playerAnimTimerSet = playerAnimTimerByVariant[tableOffset]!;
}
