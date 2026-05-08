import type { GameRam } from './types.js';

/** Mirrors the frame-timer tick that includes the game-timer control slot. */
export function tickGameTimerControl(ram: GameRam): void {
  if (ram.timerControl !== 0) {
    return;
  }

  if (ram.gameTimerCtrlTimer === 0) {
    return;
  }

  ram.gameTimerCtrlTimer -= 1;
}
