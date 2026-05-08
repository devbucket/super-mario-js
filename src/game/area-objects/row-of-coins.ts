import { CoinMetatileData } from '../../data/extracted/metatile-dictionaries.js';
import { chkLargeObjectLength } from '../chk-large-object-length.js';
import { renderUnderPart } from '../render-under-part.js';
import type { GameRam } from '../types.js';

export function rowOfCoins(ram: GameRam): void {
  const metatile = CoinMetatileData[ram.areaType];

  chkLargeObjectLength(ram, ram.objectOffset);
  renderUnderPart(ram, ram.objectRowIndex, metatile, 0);
}
