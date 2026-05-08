import { chkLargeObjectLength } from '../chk-large-object-length.js';
import type { GameRam } from '../types.js';

export function questionBlockRowLow(ram: GameRam): void {
  chkLargeObjectLength(ram, ram.objectOffset);
  ram.metatileBuffer[7] = 0xc0;
}
