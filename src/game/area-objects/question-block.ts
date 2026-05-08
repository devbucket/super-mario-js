import { BrickQBlockMetatiles } from '../../data/extracted/metatile-dictionaries.js';
import { getLargeObjectAttribute } from '../get-large-object-attribute.js';
import { renderUnderPart } from '../render-under-part.js';
import type { GameRam } from '../types.js';

export function questionBlock(ram: GameRam): void {
  const metatile = BrickQBlockMetatiles[ram.scratchObjectBits];

  getLargeObjectAttribute(ram, ram.objectOffset);
  renderUnderPart(ram, ram.objectRowIndex, metatile, 0);
}
