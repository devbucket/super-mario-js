import { HoleMetatiles } from '../../data/extracted/metatile-dictionaries.js';
import { chkLargeObjectLength } from '../chk-large-object-length.js';
import { renderUnderPart } from '../render-under-part.js';
import type { GameRam } from '../types.js';

export function holeEmpty(ram: GameRam): void {
  chkLargeObjectLength(ram, ram.objectOffset);
  const metatile = HoleMetatiles[ram.areaType];

  renderUnderPart(ram, 8, metatile, 0x0f);
}
