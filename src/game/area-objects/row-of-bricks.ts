import { BrickMetatiles } from '../../data/extracted/metatile-dictionaries.js';
import { chkLargeObjectLength } from '../chk-large-object-length.js';
import { renderUnderPart } from '../render-under-part.js';
import type { GameRam } from '../types.js';

export function rowOfBricks(ram: GameRam): void {
  let index = ram.areaType;

  if (ram.cloudTypeOverride !== 0) {
    index = 4;
  }

  const metatile = BrickMetatiles[index];

  chkLargeObjectLength(ram, ram.objectOffset);
  renderUnderPart(ram, ram.objectRowIndex, metatile, 0);
}
