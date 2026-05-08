import type { GameRam } from './types.js';

export function getAreaObjectXPosition(ram: GameRam): number {
  return ram.currentColumnPos << 4;
}
