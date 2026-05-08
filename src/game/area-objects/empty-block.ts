import { getLargeObjectAttribute } from '../get-large-object-attribute.js';
import { renderUnderPart } from '../render-under-part.js';
import type { GameRam } from '../types.js';

export function emptyBlock(ram: GameRam): void {
  getLargeObjectAttribute(ram, ram.objectOffset);
  renderUnderPart(ram, ram.objectRowIndex, 0xc4, 0);
}
