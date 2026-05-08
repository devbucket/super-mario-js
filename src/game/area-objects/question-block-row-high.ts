import { chkLargeObjectLength } from '../chk-large-object-length.js';
import type { GameRam } from '../types.js';

export function questionBlockRowHigh(ram: GameRam): void {
  chkLargeObjectLength(ram, ram.objectOffset);
  ram.metatileBuffer[3] = 0xc0;
}
