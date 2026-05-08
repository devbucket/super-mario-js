import { blockBufferXAdder } from '../data/block-buffer-collision-adders.js';
import { METATILE_PX } from '../engine/ppu/types.js';
import { computeColumnByteForBlockBuffer } from './block-buffer-collision.js';
import { getBlockBufferAddr } from './get-block-buffer-addr.js';
import { resolvePlayerBlockBufferEbValue } from './resolve-player-foot-collision-adder-y.js';
import type { GameRam } from './types.js';
import { filterMetatileByteForBlockBuffer } from './utils/filter-metatile-byte-for-block-buffer.js';

const ROWS = 13;

/**
 * Fills both block buffers from the level grid so every slot reachable by `playerBgCollision`
 * probes (head, feet, sides — indices `eb` through `eb + 6`) matches `computeColumnByteForBlockBuffer`
 * for some X within each world metatile column in the scroll window.
 */
export function syncBlockBuffersFromGrid(ram: GameRam, grid: Uint8Array, gridWidthColumns: number, scrollXPx: number): void {
  const colLeft = Math.floor(scrollXPx / METATILE_PX);
  const eb = resolvePlayerBlockBufferEbValue(ram);
  const probeMaxY = eb + 6;

  for (let wc = colLeft; wc < colLeft + 32; wc++) {
    for (let localX = 0; localX < METATILE_PX; localX++) {
      const worldXPx = wc * METATILE_PX + localX;
      const xPx = worldXPx & 0xff;
      const pageLoc = (worldXPx >>> 8) & 0xff;

      for (let probeY = eb; probeY <= probeMaxY; probeY++) {
        const xAdder = blockBufferXAdder[probeY] ?? 0;
        const columnByte = computeColumnByteForBlockBuffer(xPx, pageLoc, xAdder);
        const { bufferIndex, columnStartOffset } = getBlockBufferAddr(columnByte);
        const buffer = bufferIndex === 0 ? ram.blockBuffer1 : ram.blockBuffer2;

        let offset = columnStartOffset;

        for (let row = 0; row < ROWS; row++) {
          let value = 0;

          if (wc >= 0 && wc < gridWidthColumns) {
            value = grid[row * gridWidthColumns + wc];
          }

          buffer[offset] = filterMetatileByteForBlockBuffer(value);
          offset += 16;
        }
      }
    }
  }

  ram.blockBufferColumnPos = colLeft & 0x1f;
}
