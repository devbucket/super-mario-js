import type { GameRam } from './types.js';

/** Big Mario uses size code 0; small uses 1 (matches boot RAM pattern). */
export function syncMarioSizeFromPowerupTier(ram: GameRam): void {
  ram.marioSizeCode = ram.marioPowerupTier === 0 ? 1 : 0;
}
