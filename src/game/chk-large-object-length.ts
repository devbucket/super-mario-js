import { getLargeObjectAttribute } from './get-large-object-attribute.js';
import type { GameRam } from './types.js';

export function chkLargeObjectLength(ram: GameRam, slot: number): boolean {
  const lengthNybbles = getLargeObjectAttribute(ram, slot);

  if ((ram.areaObjectLengthSlots[slot] & 0x80) === 0) {
    return false;
  }

  ram.areaObjectLengthSlots[slot] = lengthNybbles;

  return true;
}
