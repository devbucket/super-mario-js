import { SolidBlockMetatiles } from '../../data/extracted/metatile-dictionaries.js';
import { getLargeObjectAttribute } from '../get-large-object-attribute.js';
import { renderUnderPart } from '../render-under-part.js';
import type { GameRam } from '../types.js';

export function columnOfSolidBlocks(ram: GameRam): void {
  const metatile = SolidBlockMetatiles[ram.areaType];
  const span = getLargeObjectAttribute(ram, ram.objectOffset);

  renderUnderPart(ram, ram.objectRowIndex, metatile, span);
}
