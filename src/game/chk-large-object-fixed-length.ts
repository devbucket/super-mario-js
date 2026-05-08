import type { GameRam } from './types.js';

export function chkLargeObjectFixedLength(ram: GameRam, slot: number, fixedLength: number): void {
  if ((ram.areaObjectLengthSlots[slot] & 0x80) !== 0) {
    ram.areaObjectLengthSlots[slot] = fixedLength;
  }
}
