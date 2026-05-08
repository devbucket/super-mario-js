import { processAreaData } from './process-area-data.js';
import { renderSceneryTerrain } from './render-scenery-terrain.js';
import type { GameRam } from './types.js';

export function areaParserCore(ram: GameRam): void {
  if (ram.backloadingFlag !== 0) {
    processAreaData(ram);
  }

  renderSceneryTerrain(ram);
}
