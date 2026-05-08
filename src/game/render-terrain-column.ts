import { Bitmasks, TerrainMetatiles, TerrainRenderBits } from '../data/extracted/metatile-dictionaries.js';
import type { GameRam } from './types.js';

export function renderTerrainColumn(ram: GameRam): void {
  let terrainMetatile = TerrainMetatiles[ram.areaType];

  if (ram.areaType === 0 && ram.worldNumber === 7) {
    terrainMetatile = 0x62;
  }

  if (ram.cloudTypeOverride !== 0) {
    terrainMetatile = 0x88;
  }

  let row = 0;
  let bitsPointer = ram.terrainControl << 1;

  while (row < 0x0d && bitsPointer + 1 < TerrainRenderBits.length) {
    let bitsByte = TerrainRenderBits[bitsPointer];

    bitsPointer++;

    if (ram.cloudTypeOverride !== 0 && row !== 0) {
      bitsByte &= 0x08;
    }

    for (let maskIdx = 0; maskIdx < 8 && row < 0x0d; maskIdx++) {
      const mask = Bitmasks[maskIdx];

      if ((bitsByte & mask) !== 0) {
        let tile = terrainMetatile;

        if (ram.areaType === 2 && row === 0x0b) {
          tile = 0x54;
        }

        ram.metatileBuffer[row] = tile;
      }

      row++;
    }

    bitsPointer++;
  }
}
