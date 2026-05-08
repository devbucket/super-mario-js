import { areaAddrOffsets, worldAddrOffsets } from '../data/extracted/world-area-pointers.js';
import type { GameRam } from './types.js';

export function findAreaPointer(ram: GameRam): void {
  const index = worldAddrOffsets[ram.worldNumber] + ram.areaNumber;

  ram.areaPointer = areaAddrOffsets[index];
}
