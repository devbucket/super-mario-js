import type { GameRam } from './types.js';

export function getLargeObjectAttribute(ram: GameRam, slot: number): number {
  const offset = ram.areaObjectOffsetBuffer[slot];
  const byte0 = ram.areaObjectBytes[offset];

  ram.objectRowIndex = byte0 & 0x0f;
  const byte1 = ram.areaObjectBytes[offset + 1];

  return byte1 & 0x0f;
}
