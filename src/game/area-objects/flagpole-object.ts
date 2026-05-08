import { renderUnderPart } from '../render-under-part.js';
import type { GameRam } from '../types.js';

export function flagpoleObject(ram: GameRam): void {
  ram.metatileBuffer[0] = 0x24;
  renderUnderPart(ram, 1, 0x25, 8);
  ram.metatileBuffer[10] = 0x61;
}
