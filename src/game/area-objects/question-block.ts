import { BrickQBlockMetatiles } from '../../data/extracted/metatile-dictionaries.js';
import { chkLargeObjectLength } from '../chk-large-object-length.js';
import { renderUnderPart } from '../render-under-part.js';
import type { GameRam } from '../types.js';

export function questionBlock(ram: GameRam): void {
  const metatile = BrickQBlockMetatiles[ram.scratchObjectBits];

  chkLargeObjectLength(ram, ram.objectOffset);
  renderUnderPart(ram, ram.objectRowIndex, metatile, 0);
}
