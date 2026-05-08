import type { GameRam } from './types.js';
import { filterMetatileByteForBlockBuffer } from './utils/filter-metatile-byte-for-block-buffer.js';

export function writeMetatileColumnToBlockBuffers(ram: GameRam): void {
  const columnPos = ram.blockBufferColumnPos & 0x1f;
  const buffer = columnPos >= 16 ? ram.blockBuffer2 : ram.blockBuffer1;
  const startOffset = columnPos & 0x0f;

  let offset = startOffset;

  for (let row = 0; row < 13; row++) {
    const value = filterMetatileByteForBlockBuffer(ram.metatileBuffer[row]);

    buffer[offset] = value;
    offset += 16;
  }
}
