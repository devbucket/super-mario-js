import { describe, expect, it } from 'vitest';
import { blockBufferCollision, computeColumnByteForBlockBuffer } from '../src/game/block-buffer-collision.js';
import { getBlockBufferAddr } from '../src/game/get-block-buffer-addr.js';

describe('computeColumnByteForBlockBuffer', () => {
  it('is stable for repeated calls (deterministic column nybble)', () => {
    expect(computeColumnByteForBlockBuffer(0x40, 0, 0x08)).toBe(computeColumnByteForBlockBuffer(0x40, 0, 0x08));
  });
});

describe('blockBufferCollision', () => {
  it('reads the buffer cell at columnStart + vertical band offset', () => {
    const blockBuffer1 = new Uint8Array(16 * 13);
    const blockBuffer2 = new Uint8Array(16 * 13);

    const xPx = 0x08;
    const page = 0;
    const xAdder = 0x08;
    const columnByte = computeColumnByteForBlockBuffer(xPx, page, xAdder);
    const { bufferIndex, columnStartOffset } = getBlockBufferAddr(columnByte);

    const buffer = bufferIndex === 0 ? blockBuffer1 : blockBuffer2;
    const yAdder = 0x04;
    let v = (160 + yAdder) & 0xff;

    v &= 0xf0;
    v = (v - 0x20) & 0xff;
    const offset = columnStartOffset + v;

    buffer[offset] = 0x99;

    const result = blockBufferCollision({
      blockBuffer1,
      blockBuffer2,
      sprObjectXPx: xPx,
      sprObjectPageLoc: page,
      sprObjectYPx: 160,
      bufferAdderIndexY: 0,
      returnHorizontalNybble: false,
    });

    expect(result.metatileFromBuffer).toBe(0x99);
  });
});
