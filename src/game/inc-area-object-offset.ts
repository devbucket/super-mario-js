import type { GameRam } from './types.js';

export function incAreaObjectOffset(ram: GameRam): void {
  ram.areaDataOffset += 2;
  ram.areaObjectPageSel = 0;
}
