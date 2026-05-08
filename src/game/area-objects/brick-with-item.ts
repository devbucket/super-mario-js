import { BrickQBlockMetatiles } from '../../data/extracted/metatile-dictionaries.js';
import { getLargeObjectAttribute } from '../get-large-object-attribute.js';
import { renderUnderPart } from '../render-under-part.js';
import type { GameRam } from '../types.js';

export function brickWithItem(ram: GameRam): void {
  const groundLevelAdder = ram.areaType === 1 ? 0 : 5;
  const metatile = BrickQBlockMetatiles[groundLevelAdder + ram.scratchObjectBits];

  getLargeObjectAttribute(ram, ram.objectOffset);
  renderUnderPart(ram, ram.objectRowIndex, metatile, 0);
}
