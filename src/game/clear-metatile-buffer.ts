import type { GameRam } from './types.js';

export function clearMetatileBuffer(ram: GameRam): void {
  ram.metatileBuffer.fill(0);
}
