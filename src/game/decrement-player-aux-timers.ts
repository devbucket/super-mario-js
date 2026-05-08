import type { GameRam } from './types.js';

/** Counts down jump helper + running helper timers. */
export function decrementPlayerAuxTimers(ram: GameRam): void {
  if (ram.jumpSwimTimer > 0) {
    ram.jumpSwimTimer -= 1;
  }

  if (ram.runningTimer > 0) {
    ram.runningTimer -= 1;
  }
}
