import { ForeSceneryData, FSceneDataOffsets } from '../data/extracted/metatile-dictionaries.js';
import type { GameRam } from './types.js';

export function renderForegroundScenery(ram: GameRam): void {
  if (ram.foregroundScenery === 0) {
    return;
  }

  let dataIndex = FSceneDataOffsets[ram.foregroundScenery - 1];

  for (let row = 0; row < 0x0d; row++) {
    const value = ForeSceneryData[dataIndex];

    if (value !== 0) {
      ram.metatileBuffer[row] = value;
    }

    dataIndex++;
  }
}
