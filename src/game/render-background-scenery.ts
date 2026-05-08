import { BackSceneryData, BackSceneryMetatiles, BSceneDataOffsets } from '../data/extracted/metatile-dictionaries.js';
import type { GameRam } from './types.js';

export function renderBackgroundScenery(ram: GameRam): void {
  if (ram.backgroundScenery === 0) {
    return;
  }

  let page = ram.currentPageLoc;

  while (page >= 3) {
    page -= 3;
  }

  const sceneryIndex = ram.backgroundScenery - 1;
  const dataOffset = (page << 4) + BSceneDataOffsets[sceneryIndex] + ram.currentColumnPos;
  const sceneryCode = BackSceneryData[dataOffset];

  if (sceneryCode === 0) {
    return;
  }

  const low = sceneryCode & 0x0f;
  const high = (sceneryCode >> 4) & 0x0f;
  let metaIndex = ((low - 1) & 0xff) * 3;
  let row = high;
  let counter = 3;

  while (counter > 0) {
    if (row >= 0x0b) {
      return;
    }

    ram.metatileBuffer[row] = BackSceneryMetatiles[metaIndex];
    metaIndex++;
    row++;
    counter--;
  }
}
