import { VerticalPipeData } from '../../data/extracted/metatile-dictionaries.js';
import { renderUnderPart } from '../render-under-part.js';
import type { GameRam } from '../types.js';
import { getPipeHeight } from './get-pipe-height.js';

export function verticalPipe(ram: GameRam): void {
  const slot = ram.objectOffset;

  getPipeHeight(ram, slot);

  let styleIndex = ram.areaObjectLengthSlots[slot];

  if (ram.scratchObjectBits !== 0) {
    styleIndex = (styleIndex + 4) & 0xff;
  }

  const row = ram.objectRowIndex;
  const tableBase = (styleIndex & 0xff) << 1;
  const topTile = VerticalPipeData[tableBase];
  const shaftTile = VerticalPipeData[tableBase + 2];

  ram.metatileBuffer[row] = topTile;

  const span = ram.verticalObjectScratch - 1;

  renderUnderPart(ram, row + 1, shaftTile, span);
}
