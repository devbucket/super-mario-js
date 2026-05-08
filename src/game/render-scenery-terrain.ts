import { clearMetatileBuffer } from './clear-metatile-buffer.js';
import { processAreaData } from './process-area-data.js';
import { renderBackgroundScenery } from './render-background-scenery.js';
import { renderForegroundScenery } from './render-foreground-scenery.js';
import { renderTerrainColumn } from './render-terrain-column.js';
import type { GameRam } from './types.js';
import { writeMetatileColumnToBlockBuffers } from './write-metatile-column-to-block-buffers.js';

export function renderSceneryTerrain(ram: GameRam): void {
  clearMetatileBuffer(ram);
  renderBackgroundScenery(ram);
  renderForegroundScenery(ram);
  renderTerrainColumn(ram);
  processAreaData(ram);
  writeMetatileColumnToBlockBuffers(ram);
}
