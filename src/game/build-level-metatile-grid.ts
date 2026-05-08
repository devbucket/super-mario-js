import { areaParserCore } from './area-parser-core.js';
import { resetAreaParserState } from './reset-area-parser-state.js';
import type { GameRam } from './types.js';

export function buildLevelMetatileGrid(ram: GameRam, widthColumns: number): Uint8Array {
  const height = 13;
  const grid = new Uint8Array(widthColumns * height);

  resetAreaParserState(ram);

  for (let col = 0; col < widthColumns; col++) {
    ram.currentColumnPos = col & 0x0f;
    ram.currentPageLoc = col >> 4;
    ram.blockBufferColumnPos = col & 0x1f;

    areaParserCore(ram);

    for (let row = 0; row < height; row++) {
      grid[row * widthColumns + col] = ram.metatileBuffer[row];
    }
  }

  return grid;
}
