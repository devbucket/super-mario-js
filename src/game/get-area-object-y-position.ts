import type { GameRam } from './types.js';

export function getAreaObjectYPosition(ram: GameRam): number {
  return (ram.objectRowIndex << 4) + 32;
}
