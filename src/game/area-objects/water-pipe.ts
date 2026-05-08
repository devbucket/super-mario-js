import { getLargeObjectAttribute } from '../get-large-object-attribute.js';
import type { GameRam } from '../types.js';

export function waterPipe(ram: GameRam): void {
  getLargeObjectAttribute(ram, ram.objectOffset);
  const row = ram.objectRowIndex;

  ram.metatileBuffer[row] = 0x6b;
  ram.metatileBuffer[row + 1] = 0x6c;
}
