import { chkLargeObjectFixedLength } from '../chk-large-object-fixed-length.js';
import { getLargeObjectAttribute } from '../get-large-object-attribute.js';
import type { GameRam } from '../types.js';

export function getPipeHeight(ram: GameRam, slot: number): void {
  chkLargeObjectFixedLength(ram, slot, 1);
  const nybbles = getLargeObjectAttribute(ram, slot);

  ram.verticalObjectScratch = nybbles & 0x07;
}
