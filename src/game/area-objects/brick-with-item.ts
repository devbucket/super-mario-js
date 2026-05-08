import { BrickQBlockMetatiles } from '../../data/extracted/metatile-dictionaries.js';
import { chkLargeObjectLength } from '../chk-large-object-length.js';
import { renderUnderPart } from '../render-under-part.js';
import type { GameRam } from '../types.js';

export function brickWithItem(ram: GameRam): void {
  let adder = 5;

  if (ram.areaType === 1) {
    adder = 0;
  }

  const metatile = BrickQBlockMetatiles[adder + ram.scratchObjectBits];

  chkLargeObjectLength(ram, ram.objectOffset);
  renderUnderPart(ram, ram.objectRowIndex, metatile, 0);
}
