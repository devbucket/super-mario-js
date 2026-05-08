import { BlockBuffLowBounds } from '../data/extracted/metatile-dictionaries.js';
import type { GameRam } from './types.js';

export function writeMetatileColumnToBlockBuffers(ram: GameRam): void {
  const columnPos = ram.blockBufferColumnPos & 0x1f;
  const buffer = columnPos >= 16 ? ram.blockBuffer2 : ram.blockBuffer1;
  const startOffset = columnPos & 0x0f;

  let offset = startOffset;

  for (let row = 0; row < 13; row++) {
    let value = ram.metatileBuffer[row];
    const paletteBits = value & 0xc0;
    const paletteIndex = paletteBits >> 6;
    const bound = BlockBuffLowBounds[paletteIndex];

    if (value < bound) {
      value = 0;
    }

    buffer[offset] = value;
    offset += 16;
  }
}
