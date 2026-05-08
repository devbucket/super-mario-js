import { playerMaximumVerticalSpeedDown } from '../data/player-physics-constants.js';
import { imposeGravityDownOnPlayer } from './impose-gravity-down-on-player.js';
import type { GameRam } from './types.js';

/** Vertical motion each air frame (`MovePlayerVertically`). */
export function movePlayerVertically(ram: GameRam): void {
  if (ram.timerControl !== 0) {
    return;
  }

  if (ram.jumpspringAnimCtrl !== 0) {
    return;
  }

  const downwardAmount = ram.verticalForce & 0xff;

  imposeGravityDownOnPlayer(ram, downwardAmount, playerMaximumVerticalSpeedDown);
}
